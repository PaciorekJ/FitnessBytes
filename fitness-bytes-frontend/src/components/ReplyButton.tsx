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
import useReply from "../hooks/useReply";
import ReplyServices, { IReply, IReplyNode } from "../services/ReplyServices";
import { MAX_CHAR } from "../services/Validators/PostValidatorService";
import {
	ReplyData,
	schema,
} from "../services/Validators/ReplyValidatorService";
import PostCard from "./PostCard";
import Reply from "./Reply";

const ReplyButton = ({ rootId, parentId = null }: IReplyNode) => {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		formState: { errors },
	} = useForm<ReplyData>({ resolver: zodResolver(schema), mode: "onChange" });
	const theme = useTheme();
	const [isOpen, setOpen] = useState(false);

	const { data: parentPost, isLoading: isLoadingPost } = usePost(rootId || "");
	const { data: parentReply, isLoading: isLoadingReply } = useReply(
		parentId || "",
	);

	const isLoading = isLoadingPost && isLoadingReply;

	const content = watch("content", "");
	const queryClient = useQueryClient();

	const createReply = async (data: ReplyData) => {
		const reply = await ReplyServices.create({
			...data,
			postId: rootId,
			parentReplyId: parentId,
		});

		if (!reply) return;

		queryClient.setQueryData<IReply[]>(
			parentId ? ["repliesByReplyId", parentId] : ["repliesByPostId", rootId],
			(oldReplies) => {
				return [...(oldReplies || []), reply];
			},
		);

		queryClient.refetchQueries({
			queryKey: parentId
				? ["repliesByReplyId", parentId]
				: ["repliesByPostId", rootId],
		});

		queryClient.invalidateQueries({
			queryKey: parentId
				? ["replyCountByReplyId", parentId]
				: ["replyCountByPostId", rootId],
		});

		setValue("content", "");
		reset({ content: "" });
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
					setValue("content", "");
					reset({ content: "" });
					setOpen(false);
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
					) : parentId ? (
						<Reply {...parentReply!} disabled={true} />
					) : (
						<PostCard {...parentPost!} disabled={true} />
					)}
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
