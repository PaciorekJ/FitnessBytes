import SendIcon from "@mui/icons-material/Send";
import {
	Divider,
	IconButton,
	InputAdornment,
	OutlinedInput,
} from "@mui/material";
import Stack from "@mui/material/Stack";
import { useQueryClient } from "@tanstack/react-query";
import { FieldValues, useForm } from "react-hook-form";
import MessageServices, { IMessage } from "../services/MessageServices";

interface Props {
	conversationId: string;
}

const Messenger = ({ conversationId }: Props) => {
	const { register, reset, handleSubmit } = useForm();
	const queryClient = useQueryClient();

	const handleUserMessage = async (data: FieldValues) => {
		const newMessage = await MessageServices.create(
			conversationId,
			data.message,
		);

		reset();

		queryClient.setQueryData(
			[`conversation-${conversationId}`, conversationId],
			(conversation: IMessage[] | undefined) => [
				...(conversation || []),
				newMessage,
			],
		);
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
