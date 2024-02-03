import { Grid, Stack } from "@mui/material";
import { ReactNode } from "react";

interface Props {
	children: ReactNode[];
}

const ContainerWrapper = ({ children }: Props) => {
	return (
		<Grid
			container
			columns={4}
			margin={"auto"}
			gap={4}
			minWidth={{ xs: "300px", sm: "500px", md: "800px" }}
			paddingY={10}>
			{children.map((c) => {
				return (
					<Grid item xs={4} md={2}>
						{c}
					</Grid>
				);
			})}
		</Grid>
	);
};

export default ContainerWrapper;
