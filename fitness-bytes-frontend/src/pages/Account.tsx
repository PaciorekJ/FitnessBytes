import AddAPhotoTwoToneIcon from "@mui/icons-material/AddAPhotoTwoTone";
import ModeEditOutlineTwoToneIcon from "@mui/icons-material/ModeEditOutlineTwoTone";
import {
	Avatar,
	Badge,
	CircularProgress,
	Divider,
	Grid,
	IconButton,
	Stack,
	Typography,
	styled,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../components/PostCard";
import usePostCount from "../hooks/usePostCount";
import usePosts from "../hooks/usePosts";
import useUserStore from "../hooks/useUserStore";

const Account = () => {
	const { username } = useParams();
	const activeUsername = useUserStore((s) => s.username);
	const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

	const ownerPermissions = username === activeUsername;

	const editBio = () => {};

	const { data } = usePosts(username);

	const bio =
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

	const posts = data || [];

	const { data: postCountData, isLoading: postCountIsLoading } = usePostCount(
		username || "",
	);

	const postCount = postCountData || 0;

	const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e || !e.target || e?.target?.files) {
			console.log("Nothing here");
		}
		const file = (e?.target?.files as FileList)[0];
		const url = URL.createObjectURL(file);
		setImagePreviewUrl(url);
		console.log(e?.target?.files);
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

	return (
		<Stack
			sx={{
				alignItems: "center",
				paddingX: 2,
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
									<VisuallyHiddenInput type="file" onChange={handleAvatar} />
									<AddAPhotoTwoToneIcon />
								</IconButton>
							)
						}>
						<Avatar
							sizes="xl"
							alt="Avatar"
							src={imagePreviewUrl || ""}
							sx={{
								width: "20vw",
								height: "20vw",
								maxWidth: "200px",
								maxHeight: "200px",
							}}
						/>
					</Badge>
				</Grid>
				<Grid item maxWidth={"700px"}>
					<Typography variant="h4" letterSpacing={".1rem"} component="h2">
						{username}
					</Typography>
					<Divider />
					<Typography variant="body2" lineHeight={"25px"}>
						{bio}
						{ownerPermissions && (
							<IconButton onClick={editBio} color="secondary">
								<ModeEditOutlineTwoToneIcon />
							</IconButton>
						)}
					</Typography>
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
					<PostCard key={p._id} {...p} />
				))}
			</Stack>
		</Stack>
	);
};

export default Account;
