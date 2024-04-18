import { Button } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import useBannerStore from "../hooks/useBannerStore";
import useIsFriend from "../hooks/useIsFriend";
import FriendRequestServices from "../services/FriendRequestServices";
import { FriendStatus } from "../services/FriendServices";
import { IUser } from "../services/UserServices";

const AddFriendButton = ({ _id, username }: IUser) => {
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

	return (
		!isLoadingIsFriend &&
		isFriend !== FriendStatus.Friend && (
			<Button
				sx={{ alignSelf: "center" }}
				variant="contained"
				onClick={
					isFriend === FriendStatus.None
						? () => handleAddFriend(_id, username)
						: () => {}
				}>
				{isFriend === FriendStatus.None ? "Add +" : "Pending..."}
			</Button>
		)
	);
};

export default AddFriendButton;
