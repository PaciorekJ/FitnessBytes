import { Avatar, SxProps } from "@mui/material";
import { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import { decodeImage } from "../utils/ImageProcessing";

interface ProfilePictureProps {
	username: string;
	sx?: SxProps;
}

const ProfilePicture = ({ username, sx }: ProfilePictureProps) => {
	const [imageUrl, setImageUrl] = useState<string>("");
	const { data: user, isLoading } = useUser(username);

	useEffect(() => {
		const createAndSetImageUrl = async () => {
			if (!user?.profilePicture || !user?.profilePictureType) {
				return;
			}
			try {
				const imageBlob = decodeImage(
					user?.profilePicture || "",
					user?.profilePictureType || "",
				);
				const url = URL.createObjectURL(imageBlob);
				setImageUrl(url);
			} catch {
				return;
			}
		};

		createAndSetImageUrl();
	}, [user?.profilePicture, user?.profilePictureType, isLoading]);

	return (
		<Avatar
			aria-label={`User Profile Icon - ${username}`}
			alt={`User Profile Icon - ${username}`}
			sx={sx || {}}
			src={imageUrl}></Avatar>
	);
};

export default ProfilePicture;
