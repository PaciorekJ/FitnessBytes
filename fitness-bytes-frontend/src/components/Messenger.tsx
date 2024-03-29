import GroupAddTwoToneIcon from "@mui/icons-material/GroupAddTwoTone";
import SendIcon from "@mui/icons-material/Send";
import {
	Divider,
	IconButton,
	InputAdornment,
	OutlinedInput,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import MessageServices, { IMessage } from "../services/MessageServices";
import SocketServices, { CallbackFn } from "../services/SocketServices";
import AddParticipantsModal from "./AddParticipantsModal";

interface Props {
	conversationId: string;
	setNewMessage: (m: IMessage) => void;
}

const Messenger = ({ conversationId, setNewMessage }: Props) => {
	const { register, reset, handleSubmit } = useForm();
	const [isOpen, setOpen] = useState(false);

	SocketServices.registerCallback(
		"Message Recieved",
		setNewMessage as CallbackFn,
	);

	const handleUserMessage = async (data: FieldValues) => {
		const newMessage =
			(await MessageServices.create(conversationId, data.message)) ||
			({} as IMessage);

		SocketServices.SendMessage(newMessage);

		reset();

		setNewMessage(newMessage);
	};

	return (
		<Stack marginY={2} minWidth={"100%"}>
			<AddParticipantsModal
				conversationId={conversationId}
				setOpen={setOpen}
				isOpen={isOpen}
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
					}
				/>
			</form>
		</Stack>
	);
};

export default Messenger;
