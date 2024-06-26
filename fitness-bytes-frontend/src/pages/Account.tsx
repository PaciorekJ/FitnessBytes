import AddAPhotoTwoToneIcon from "@mui/icons-material/AddAPhotoTwoTone";
import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
import ModeEditOutlineTwoToneIcon from "@mui/icons-material/ModeEditOutlineTwoTone";
import {
	Badge,
	Box,
	CircularProgress,
	Container,
	Divider,
	Grid,
	IconButton,
	Stack,
	TextField,
	Typography,
	styled,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import AddFriendButton from "../components/AddFriendButton";
import PageSpinner from "../components/PageSpinner";
import PostCard from "../components/PostCard";
import ProfilePicture from "../components/ProfilePicture";
import useBannerStore from "../hooks/useBannerStore";
import usePostCount from "../hooks/usePostCount";
import usePosts from "../hooks/usePosts";
import useUser from "../hooks/useUser";
import useUserStore from "../hooks/useUserStore";
import UserServices, { IUser } from "../services/UserServices";
import { compressImage, encodeImage } from "../utils/ImageProcessing";

const Account = () => {
	const { username } = useParams();
	const activeUsername = useUserStore((s) => s.username);
	const { data: user, isLoading: userIsLoading } = useUser(username!);
	const setBanner = useBannerStore((s) => s.setBanner);

	const queryClient = useQueryClient();

	const ownerPermissions = username === activeUsername;

	const { data, fetchNextPage, hasNextPage } = usePosts(username);

	const [editBioMode, setEditBioMode] = useState(false);
	const [editableBio, setEditableBio] = useState(user?.bio || "");
	const [processingBio, setProcessingBio] = useState(false);

	useEffect(() => {
		if (userIsLoading || !user?.bio) {
			setEditableBio("");
			return;
		}

		setEditableBio(user.bio);
	}, [user?.bio, userIsLoading, username]);

	const postsPages = data?.pages || [];

	const { data: postCountData, isLoading: postCountIsLoading } = usePostCount(
		username || "",
	);

	const postCount = postCountData || 0;

	const saveBio = async () => {
		if (processingBio) return;

		setProcessingBio(true);
		const res = await UserServices.setBio(editableBio || "");
		if (!res) {
			setBanner(
				"Error: Your Bio failed to be set at the moment. Please try again later",
				true,
			);
		}
		setProcessingBio(false);
		setEditBioMode(false);
	};

	const handleProfilePicture = async (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		if (!e.target.files || e.target.files.length === 0) {
			setBanner("Error: A invalid photo, or no photo was selected!", true);
			return;
		}

		const file = e.target.files[0];

		try {
			const compressedImage = await compressImage(file);
			const base64Array = await encodeImage(compressedImage);
			const res = await UserServices.setProfilePicture(
				base64Array,
				compressedImage.type,
			);
			if (!res)
				throw new Error("Image may be too large, or not a supported type");

			queryClient.setQueryData<IUser>(
				[`users-${activeUsername}`, activeUsername], // Ensure this query key matches what you used to fetch user data
				(oldData) => {
					return {
						...oldData!,
						profilePicture: base64Array,
						profilePictureType: compressedImage.type,
					};
				},
			);

			setBanner("Successfully set Profile Picture");
		} catch (error) {
			setBanner(`${error}`, true);
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

	if (!user)
		return (
			<Container>
				<Typography textAlign={"center"} variant="h3" padding={4}>
					Error: User doesn't Exist
				</Typography>
			</Container>
		);

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
							key={username}
							username={username!}
							sx={{
								width: "200px",
								height: "200px",
							}}
						/>
					</Badge>
				</Grid>
				<Grid item maxWidth={"800px"}>
					<Stack flexDirection={"row"} justifyContent={"space-between"}>
						<Typography variant="h4" letterSpacing={".1rem"} component="h2">
							{username}
						</Typography>
						{!ownerPermissions && user && (
							<AddFriendButton {...user} actionDelete={true} />
						)}
					</Stack>
					<Divider sx={{ padding: 1.5 }} />
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
								"minWidth": { xs: "90vw", lg: "650px" },
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
							{processingBio ? (
								<Stack margin={1.5}>
									<CircularProgress size={"1rem"} />
								</Stack>
							) : editBioMode ? (
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
				<InfiniteScroll
					hasMore={hasNextPage}
					loader={<PageSpinner />}
					next={fetchNextPage}
					dataLength={postsPages?.length || 0}>
					{postsPages.map((postsPage) =>
						postsPage?.posts.map((p) => (
							<PostCard key={p._id} {...p} postQueryKey={username} />
						)),
					)}
				</InfiniteScroll>
			</Stack>
		</Stack>
	);
};

export default Account;
