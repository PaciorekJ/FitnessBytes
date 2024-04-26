import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import useBannerStore from "../hooks/useBannerStore";
import useIsFriend from "../hooks/useIsFriend";
import FriendRequestServices from "../services/FriendRequestServices";
import FriendServices, { FriendStatus } from "../services/FriendServices";
import { IUser } from "../services/UserServices";

interface addFriendButtonProps extends IUser {
	actionDelete?: boolean | undefined;
}

const AddFriendButton = ({
	_id,
	username,
	actionDelete = false,
}: addFriendButtonProps) => {
	const { data: isFriend, isLoading: isLoadingIsFriend } = useIsFriend(
		username || "",
	);
	const setBanner = useBannerStore((s) => s.setBanner);

	const queryClient = useQueryClient();

	const handleAddFriend = async (_id: string, toUsername: string) => {
		const friendRequest = await FriendRequestServices.create(_id);

		queryClient.setQueryData(
			[`isFriend-${username}`, username],
			() => FriendStatus.Pending,
		);

		if (friendRequest) {
			setBanner(`Friend Request has been sent to ${toUsername}`);
		} else {
			setBanner(
				`Friend Request could not be send. A friend request is already pending or you guys are already friends`,
				true,
			);
		}
	};

	const handleDeleteFriend = async (_id: string, toUsername: string) => {
		const isDeleted = await FriendServices.delete(_id);

		queryClient.setQueryData(
			[`isFriend-${username}`, username],
			() => FriendStatus.None,
		);

		if (isDeleted) {
			setBanner(`${toUsername} has been unfriended`);
		} else {
			setBanner(
				`${toUsername} couldn't be unfriended at the moment. Please try again later`,
				true,
			);
		}
	};

	let buttonOnClick = () => {};
	let buttonText = "";

	if (isFriend === FriendStatus.None) {
		buttonOnClick = () => handleAddFriend(_id, username);
		buttonText = "Add +";
	} else if (isFriend === FriendStatus.Pending) {
		buttonText = "Pending...";
	} else if (isFriend === FriendStatus.Friend && actionDelete) {
		buttonOnClick = () => handleDeleteFriend(_id, username);
		buttonText = "Remove";
	}

	return (
		(!isLoadingIsFriend && isFriend !== FriendStatus.Friend && (
			<Button
				sx={{ alignSelf: "center" }}
				variant="contained"
				onClick={buttonOnClick}>
				{buttonText}
			</Button>
		)) ||
		(actionDelete && (
			<Button
				sx={{ alignSelf: "center", color: "error" }}
				variant="text"
				color="warning"
				onClick={buttonOnClick}>
				{buttonText}
			</Button>
		))
	);
};

export default AddFriendButton;
