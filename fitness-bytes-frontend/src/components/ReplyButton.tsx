import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import ReplyIcon from "@mui/icons-material/Reply";
import {
	Alert,
	Box,
	Button,
	Card,
	CircularProgress,
	Divider,
	IconButton,
	Modal,
	TextField,
	Typography,
	useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import usePost from "../hooks/usePost";
import ReplyServices from "../services/ReplyServices";
import {
	MAX_CHAR,
	PostData,
} from "../services/Validators/PostValidatorService";
import {
	ReplyData,
	schema,
} from "../services/Validators/ReplyValidatorService";
import PostCard from "./PostCard";

interface ReplyButtonProps {
	postId?: string;
	replyId?: string;
}

const ReplyButton = ({ postId }: ReplyButtonProps) => {
	const {
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<ReplyData>({ resolver: zodResolver(schema), mode: "onChange" });
	const theme = useTheme();
	const [isOpen, setOpen] = useState(false);
	const { data: parentPost, isLoading } = usePost(postId || "");
	const content = watch("content", "");
	const queryClient = useQueryClient();

	const createReply = async (data: PostData) => {
		await ReplyServices.create({
			...data,
			postId,
		});

		queryClient.invalidateQueries({ queryKey: ["replyCountByPostId", postId] });

		setOpen(false);
	};

	return (
		<>
			<IconButton
				onClick={() => setOpen(true)}
				aria-label="write a reply to this post">
				<ReplyIcon />
			</IconButton>
			<Modal
				open={isOpen}
				onClose={() => {
					setOpen(false);
					reset();
				}}>
				<Card
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: "98%",
						maxWidth: "600px",
						maxHeight: "98vh",
						overflowY: "auto",
						bgcolor: "background.default",
						border: "2px solid primary.light",
						borderRadius: "25px",
						boxShadow: "0px 0px 10vh " + theme.palette.primary.light,
						p: { xs: 1, md: 2 },
					}}
					variant="outlined">
					{isLoading ? (
						<CircularProgress />
					) : parentPost ? (
						<PostCard {...parentPost} disabled={true} />
					) : null}
					<form onSubmit={handleSubmit(createReply)}>
						{errors.content && content.length !== 0 && (
							<Alert color="error">{errors.content?.message}</Alert>
						)}
						<Box padding={2}>
							<TextField
								sx={{ border: "1px solid" }}
								id="content"
								autoFocus
								fullWidth
								rows={4}
								{...register("content", {
									required: true,
								})}
								placeholder="Reply..."
								multiline
							/>
						</Box>
						<Typography>{MAX_CHAR - content.length} characters left</Typography>
						<Divider />
						<Button
							sx={{ margin: 2 }}
							variant="contained"
							color="secondary"
							type="submit">
							Reply
						</Button>
					</form>
				</Card>
			</Modal>
		</>
	);
};

export default ReplyButton;
