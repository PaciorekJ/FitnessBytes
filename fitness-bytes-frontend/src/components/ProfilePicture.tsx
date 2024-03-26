import { Avatar, SxProps } from "@mui/material";
import { useEffect, useState } from "react";
import { decodeImage } from "../utils/ImageProcessing";

interface ProfilePictureProps {
	username: string;
	base64Image?: string;
	pictureType?: string;
	url?: string;
	sx?: SxProps;
}

const ProfilePicture = ({
	username,
	base64Image,
	pictureType,
	url,
	sx,
}: ProfilePictureProps) => {
	const [imageUrl, setImageUrl] = useState(url);

	useEffect(() => {
		const createAndSetImageUrl = async () => {
			if (imageUrl) {
				return;
			}
			try {
				const imageBlob = decodeImage(base64Image, pictureType || "");
				const url = URL.createObjectURL(imageBlob);
				setImageUrl(url);
			} catch {
				return;
			}
		};

		createAndSetImageUrl();
	}, [base64Image, imageUrl, pictureType]);

	return (
		<Avatar
			aria-label={`User Profile Icon - ${username}`}
			sx={sx || {}}
			src={base64Image ? imageUrl : ""}></Avatar>
	);
};

export default ProfilePicture;
