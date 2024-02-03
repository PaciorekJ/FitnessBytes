import { Grid } from "@mui/material";
import { ReactNode } from "react";

interface Props {
	children: ReactNode[];
}

const ContainerWrapper = ({ children }: Props) => {
	return (
		<Grid
			container
			columns={{ xs: 1, lg: 2 }}
			margin={"auto"}
			gap={4}
			paddingY={10}>
			{children.map((c) => {
				return (
					<Grid item xs md>
						{c}
					</Grid>
				);
			})}
		</Grid>
	);
};

export default ContainerWrapper;
