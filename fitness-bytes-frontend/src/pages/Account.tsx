import AddAPhotoTwoToneIcon from "@mui/icons-material/AddAPhotoTwoTone";
import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import ModeEditOutlineTwoToneIcon from "@mui/icons-material/ModeEditOutlineTwoTone";
import {
	Badge,
	Box,
	CircularProgress,
	Divider,
	Grid,
	IconButton,
	Stack,
	TextField,
	Typography,
	styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PageSpinner from "../components/PageSpinner";
import PostCard from "../components/PostCard";
import ProfilePicture from "../components/ProfilePicture";
import useBannerStore from "../hooks/useBannerStore";
import usePostCount from "../hooks/usePostCount";
import usePosts from "../hooks/usePosts";
import useUser from "../hooks/useUser";
import useUserStore from "../hooks/useUserStore";
import UserServices from "../services/UserServices";
import {
	compressImage,
	decodeImage,
	encodeImage,
} from "../utils/ImageProcessing";

const Account = () => {
	const { username } = useParams();
	const activeUsername = useUserStore((s) => s.username);
	const { data: user, isLoading: userIsLoading } = useUser(username || "");
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
	const setBanner = useBannerStore((s) => s.setBanner);
	const [editBioMode, setEditBioMode] = useState(false);

	const ownerPermissions = username === activeUsername;

	const { data } = usePosts(username);

	const [editableBio, setEditableBio] = useState(user?.bio || "");

	useEffect(() => {
		if (userIsLoading || !user?.bio) return;

		setEditableBio(user.bio);
	}, [user?.bio, userIsLoading]);

	useEffect(() => {
		if (userIsLoading || !user?.profilePicture || !user?.profilePictureType)
			return;

		const setProfilePicture = async () => {
			const imageBlob = await decodeImage(
				user.profilePicture,
				user.profilePictureType,
			);
			const url = URL.createObjectURL(imageBlob);
			setImagePreviewUrl(url);
		};

		setProfilePicture();
	}, [user?.profilePicture, user?.profilePictureType, userIsLoading]);

	const posts = data || [];

	const { data: postCountData, isLoading: postCountIsLoading } = usePostCount(
		username || "",
	);

	const postCount = postCountData || 0;

	const saveBio = async () => {
		const res = await UserServices.setBio(editableBio);
		if (!res) {
			setBanner(
				"Error: Your Bio failed to be set at the moment. Please try again later",
				true,
			);
		}

		setEditBioMode(false); // Toggle back to view mode after saving
	};

	const handleProfilePicture = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (!e || !e.target || !e?.target?.files) {
			setBanner("Error: A invalid photo, or no photo was selected!", true);
		}

		const file = (e?.target?.files as FileList)[0];

		try {
			const compressedImage = await compressImage(file);

			const base64Array = await encodeImage(compressedImage);
			await UserServices.setProfilePicture(base64Array, compressedImage.type);

			const url = URL.createObjectURL(compressedImage);
			setImagePreviewUrl(url);
		} catch {
			setBanner("We failed to upload your photo!", true);
		}
	};

	const VisuallyHiddenInput = styled("input")({
		clip: "rect(0 0 0 0)",
		clipPath: "inset(50%)",
		height: 1,
		overflow: "hidden",
		position: "absolute",
		bottom: 0,
		left: 0,
		whiteSpace: "nowrap",
		width: 1,
	});

	if (userIsLoading) return <PageSpinner />;

	return (
		<Stack
			sx={{
				alignItems: "center",
				padding: 2,
			}}>
			<Grid
				container
				spacing={2}
				sx={{ alignItems: "center", justifyContent: "center" }}
				maxWidth={"1300px"}
				columns={{ xs: 2, md: 4 }}>
				<Grid
					item
					sx={{
						alignItems: "center",
						justifyContent: "center",
						gap: 1,
					}}>
					<Badge
						overlap="circular"
						anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
						badgeContent={
							ownerPermissions && (
								<IconButton component="label" color="secondary">
									<VisuallyHiddenInput
										type="file"
										onChange={handleProfilePicture}
									/>
									<AddAPhotoTwoToneIcon />
								</IconButton>
							)
						}>
						<ProfilePicture
							username={username!}
							base64Image={user?.profilePicture || ""}
							pictureType={user?.profilePictureType || ""}
							url={imagePreviewUrl || ""}
							sx={{
								width: "200px",
								height: "200px",
							}}
						/>
					</Badge>
				</Grid>
				<Grid item maxWidth={"700px"}>
					<Typography variant="h4" letterSpacing={".1rem"} component="h2">
						{username}
					</Typography>
					<Divider sx={{ marginY: 1 }} />
					{!editBioMode ? (
						<Typography
							component={"p"}
							minWidth={{ xs: "90vw", lg: "700px" }}
							color={editableBio ? "" : "text.disabled"}
							variant="body2"
							lineHeight={"25px"}
							letterSpacing={0.75}
							padding={1.9}>
							{editableBio ? editableBio : `No Bio`}
						</Typography>
					) : (
						<TextField
							autoFocus
							fullWidth
							sx={{
								"minWidth": { xs: "90vw", lg: "700px" },
								"display": "inline-block",
								"letterSpacing": 0.75,
								"lineHeight": "25px",
								"border": "none",
								"& .MuiInputBase-input": {
									fontSize: ".9rem",
								},
							}}
							value={editableBio}
							onChange={(e) => setEditableBio(e.target.value)}
							multiline
						/>
					)}
					{ownerPermissions && (
						<Box>
							{editBioMode ? (
								<IconButton onClick={saveBio}>
									<DoneTwoToneIcon />
								</IconButton>
							) : (
								<IconButton onClick={() => setEditBioMode(true)}>
									<ModeEditOutlineTwoToneIcon />
								</IconButton>
							)}
						</Box>
					)}
				</Grid>
			</Grid>
			<Stack margin={1} flexDirection={"row"} gap={2}>
				<Stack flexDirection={"row"} gap={"5px"}>
					{postCountIsLoading ? (
						<CircularProgress size={"1.25rem"} />
					) : (
						<Typography fontWeight={"700"}>{postCount}</Typography>
					)}
					<Typography>Posts</Typography>
				</Stack>
				<Stack flexDirection={"row"} gap={"5px"}></Stack>
			</Stack>
			<Divider orientation="horizontal" variant="fullWidth" />
			<Stack width={"100%"} maxWidth={"700px"}>
				{posts?.map((p) => (
					<PostCard key={p._id} {...p} postQueryKey={username}/>
				))}
			</Stack>
		</Stack>
	);
};

export default Account;
