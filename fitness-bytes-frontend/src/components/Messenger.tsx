import SendIcon from "@mui/icons-material/Send";
import {
	Divider,
	IconButton,
	InputAdornment,
	OutlinedInput,
} from "@mui/material";
import Stack from "@mui/material/Stack";

const Messenger = () => {
	// const {} = useForm();

	return (
		<Stack marginY={2} minWidth={"100%"}>
			<OutlinedInput
				id="message"
				multiline
				sx={{
					borderEndEndRadius: "30px",
					borderStartEndRadius: "30px",
					border: "1px solid",
				}}
				fullWidth
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
		</Stack>
	);
};

export default Messenger;
