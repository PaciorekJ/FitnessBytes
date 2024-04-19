import GroupAddTwoToneIcon from "@mui/icons-material/GroupAddTwoTone";
import SendIcon from "@mui/icons-material/Send";
import {
	CircularProgress,
	Divider,
	IconButton,
	InputAdornment,
	OutlinedInput,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import ConversationServices from "../services/ConversationService";
import MessageServices, { IMessage } from "../services/MessageServices";
import SocketServices, { CallbackFn } from "../services/SocketServices";
import ConversationModal from "./ConversationModal";

interface Props {
	conversationId: string;
	setNewMessage: (m: IMessage) => void;
}

const Messenger = ({ conversationId, setNewMessage }: Props) => {
	const { register, reset, handleSubmit } = useForm();
	const [isOpen, setOpen] = useState(false);
	const [processingMessage, setProcessingMessage] = useState(false);

	SocketServices.registerCallback(
		"Message Recieved",
		setNewMessage as CallbackFn,
	);

	const handleUserMessage = async (data: FieldValues) => {
		if (processingMessage) return;
		setProcessingMessage(true);

		const newMessage =
			(await MessageServices.create(conversationId, data.message)) ||
			({} as IMessage);

		SocketServices.SendMessage(newMessage);

		reset();

		setNewMessage(newMessage);

		setProcessingMessage(false);
	};

	return (
		<Stack
			position={"absolute"}
			sx={{ backgroundColor: "background.default" }}
			bottom={0}
			padding={2}
			width={"100%"}>
			<ConversationModal
				_id={conversationId}
				setOpen={setOpen}
				isOpen={isOpen}
				action={ConversationServices.updateParticipants}
				header={"Add More Participants to your current Conversation"}
				subheaderWarning={"You can only have conversations with friends"}
				submitButton={"Update conversation Participants"}
				participantsAction={true}
				titleAction={false}
			/>
			<form onSubmit={handleSubmit(handleUserMessage)}>
				<OutlinedInput
					id="message"
					multiline
					sx={{
						borderEndEndRadius: "30px",
						borderStartEndRadius: "30px",
						border: "2px solid",
					}}
					fullWidth
					{...register("message")}
					startAdornment={
						<IconButton
							onClick={() => setOpen(true)}
							aria-label="Open modal to add Participants"
							type="button"
							sx={{
								"height": "0px",
								":hover": {
									background: "0",
									color: "primary.main",
								},
							}}
							size={"large"}
							edge="start">
							<GroupAddTwoToneIcon />
						</IconButton>
					}
					endAdornment={
						processingMessage ? (
							<Stack
								paddingX={1}
								justifyContent={"center"}
								alignItems={"center"}>
								<CircularProgress size={"1rem"} />
							</Stack>
						) : (
							<InputAdornment position="end">
								<IconButton
									aria-label="send the message"
									type="submit"
									sx={{
										":hover": {
											background: "0",
											color: "primary.main",
										},
									}}
									size={"large"}
									edge="end">
									<Divider orientation="vertical" />
									<SendIcon />
								</IconButton>
							</InputAdornment>
						)
					}
				/>
			</form>
		</Stack>
	);
};

export default Messenger;
