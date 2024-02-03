import { Grid } from "@mui/material";
import { ReactNode } from "react";

interface Props {
	
	children: ReactNode[];
}

const AuthenticationContainer = ({ children }: Props) => {
	return (
		<Grid
			container
			columns={{ xs: 1, xl: 2 }}
			margin={"auto"}
			gap={4}
			paddingY={10}>
			{children.map((c, i) => {
				return (
					<Grid key={i} item xs md>
						{c}
					</Grid>
				);
			})}
		</Grid>
	);
};

export default AuthenticationContainer;
