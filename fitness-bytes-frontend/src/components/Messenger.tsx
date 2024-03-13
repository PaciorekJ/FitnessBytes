import SendIcon from "@mui/icons-material/Send";
import {
	Divider,
	IconButton,
	InputAdornment,
	OutlinedInput,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { FieldValues, useForm } from "react-hook-form";
import MessageServices, { IMessage } from "../services/MessageServices";
import SocketServices from "../services/SocketServices";

interface Props {
	conversationId: string;
	setNewMessage: (m: IMessage) => void;
}

const Messenger = ({ conversationId, setNewMessage }: Props) => {
	const { register, reset, handleSubmit } = useForm();

	SocketServices.registerCallback("Message Recieved", setNewMessage);

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
			<form onSubmit={handleSubmit(handleUserMessage)}>
				<OutlinedInput
					id="message"
					multiline
					sx={{
						borderEndEndRadius: "30px",
						borderStartEndRadius: "30px",
						border: "1px solid",
					}}
					fullWidth
					{...register("message")}
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
