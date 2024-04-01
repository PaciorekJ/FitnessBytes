import {
	Alert,
	Box,
	Button,
	Card,
	CardActions,
	CardHeader,
	Divider,
	TextField,
	Typography,
	styled,
	useTheme,
} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";

import CloseIcon from "@mui/icons-material/Close";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import useBannerStore from "../hooks/useBannerStore";
import {
	MAX_CHAR,
	PostData,
	schema,
} from "../services/Validators/PostValidatorService";
import {
	compressImage,
	decodeImage,
	encodeImage,
} from "../utils/ImageProcessing";
import { IImage } from "./AddPost";
import ProfilePicture from "./ProfilePicture";
import _ from "lodash";

interface ModalProps {
	onSubmit: (data: PostData) => void;
	setImage: Dispatch<SetStateAction<IImage>>;
	image: IImage | null;
	onClose?: () => void;
	isOpen: boolean;
	setOpen: (state: boolean) => void;
	ariaLabelledby: string;
	ariaDescribedby: string;
}

interface Props extends ModalProps {
	error: string;
	username: string;
	textValue: string;
	buttonContent: string;
	resetOnSubmit?: boolean;
}

const PostModal = ({
	onSubmit,
	onClose,
	image,
	setImage,
	setOpen,
	isOpen,
	username,
	error,
	textValue,
	ariaLabelledby,
	ariaDescribedby,
	buttonContent,
	resetOnSubmit = false,
}: Props) => {
	const {
		register,
		handleSubmit,
		watch,
		reset,
		setValue,
		formState: { errors },
	} = useForm<PostData>({ resolver: zodResolver(schema), mode: "all" });
	const setBanner = useBannerStore((s) => s.setBanner);

	const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files || e.target.files.length === 0) {
			setBanner("Error: A invalid image, or no image was selected!", true);
			return;
		}

		const file = e.target.files[0];

		try {
			const compressedImage = await compressImage(file);
			const base64Array = await encodeImage(compressedImage);

			const imageBlob = decodeImage(base64Array, compressedImage.type);

			const url = URL.createObjectURL(imageBlob);

			setImage({
				base64Array: base64Array,
				type: compressedImage.type,
				imageUrl: url,
			});

			const files = e.target?.files || null;
			if (files) {
				setValue("image", files[0], { shouldValidate: true });
			}
		} catch (error) {
			setBanner(`${error}`, true);
		}
	};

	const [text, setText] = useState(textValue);
	const theme = useTheme();

	const handleChange = (e: {
		preventDefault: () => void;
		target: { value: SetStateAction<string> };
	}) => {
		e.preventDefault();
		setText(e.target.value);
	};

	const closeModal = () => setOpen(false);

	const content = watch("content", "");

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
		<Modal
			open={isOpen}
			onClose={() => {
				closeModal();
				if (onClose) onClose();
				reset();
				setText("");
				setImage({} as IImage);
			}}
			aria-labelledby={ariaLabelledby}
			aria-describedby={ariaDescribedby}>
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
				<form
					onSubmit={handleSubmit((data) => {
						if (resetOnSubmit) {
							setText("");
						}
						reset();
						onSubmit(data);
					})}
					onReset={() => {
						if (onClose) onClose();
						reset();
						closeModal();
					}}>
					<Stack
						sx={{
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
						}}>
						<CardHeader
							title={username}
							avatar={<ProfilePicture username={username} />}
						/>
						<IconButton type="reset">
							<CloseIcon />
						</IconButton>
					</Stack>
					<Box paddingX={2}>
						<Divider />
					</Box>
					{!_.isEmpty(image) && image.imageUrl && (
						<Stack padding={2} width={"100%"} alignItems={"center"}>
							<img
								src={image.imageUrl}
								width={"50%"}
								alt={`${username} - post's image`}
							/>
						</Stack>
					)}
					{(error && <Alert color="error">{error}</Alert>) ||
						(errors.content && content.length !== 0 && (
							<Alert color="error">{errors.content?.message}</Alert>
						)) ||
						(errors.image && (
							<Alert color="error">{errors.image?.message}</Alert>
						))}
					<Box padding={2}>
						<TextField
							sx={{ border: "1px solid" }}
							id="content"
							autoFocus
							fullWidth
							rows={4}
							{...register("content", {
								required: true,
								onChange: handleChange,
							})}
							placeholder="Share A Fitness Byte..."
							value={text}
							multiline
						/>
					</Box>
					{<Typography>{MAX_CHAR - content.length} characters left</Typography>}
					<Divider />
					<CardActions>
						<Stack
							sx={{
								flexDirection: "row",
								justifyContent: "space-between",
								width: "100%",
							}}>
							<Stack flexDirection={"row"}>
								<IconButton component="label" color="secondary">
									<VisuallyHiddenInput
										{...(register("image"),
										{
											onChange: handleImage,
										})}
										type="file"
									/>
									<ImageOutlinedIcon />
								</IconButton>
								<IconButton>
									<LinkOutlinedIcon />
								</IconButton>
							</Stack>
							<Button variant="contained" color="secondary" type="submit">
								{buttonContent}
							</Button>
						</Stack>
					</CardActions>
				</form>
			</Card>
		</Modal>
	);
};

export default PostModal;
