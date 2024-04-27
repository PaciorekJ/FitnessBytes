import ChatIcon from "@mui/icons-material/Chat";
import GroupIcon from "@mui/icons-material/Group";
import NetworkCellIcon from "@mui/icons-material/NetworkCell";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import PostAddIcon from "@mui/icons-material/PostAdd";
import {
	Box,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Typography,
} from "@mui/material";

const featureList = [
	{
		Icon: ChatIcon,
		title: "Instant Messaging",
		description:
			"Connect instantly with fellow fitness enthusiasts and professionals with real-time messaging.",
	},
	{
		Icon: PersonIcon,
		title: "Customizable Profiles",
		description:
			"Craft your unique fitness story with personalized bios, profile photos, and posts on FitnessBytes. Make every detail reflect your progress and individuality.",
	},
	{
		Icon: PostAddIcon,
		title: "Interactive Posts",
		description:
			"Like, comment, and share workout videos and nutritional guides.",
	},
	{
		Icon: NotificationsIcon,
		title: "Real-time Notifications",
		description:
			"Stay updated with instant notifications about your fitness circle’s latest activities.",
	},
	{
		Icon: NetworkCellIcon,
		title: "Professional Networking",
		description:
			"Expand influence, connect with clients, and build your professional network.",
	},
	{
		Icon: GroupIcon,
		title: "Community Engagement",
		description:
			"Join group challenges and find the support you need to stay committed.",
	},
];

const styles = {
	list: {
		margin: "auto",
		padding: 4,
		overflow: "hidden",
	},
	listItem: {
		paddingY: 2.5,
	},
	listItemIcon: {
		minWidth: "50px",
		color: "#f47227",
	},
	listItemTextPrimary: {
		fontWeight: "bold",
		color: "secondary.light",
	},
	listItemTextSecondary: {
		color: "gray",
	},
};

const FeatureList = ({ id }: { id: string }) => {
	return (
		<Box
			id={id}
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				padding: 5,
				marginTop: 5,
			}}>
			<Typography
				maxWidth={"800px"}
				margin={"auto"}
				component={"h2"}
				variant="h3"
				letterSpacing={"-.05rem"}>
				Key Features
			</Typography>
			<List sx={styles.list}>
				{featureList.map((feature, index) => (
					<ListItem key={index} sx={styles.listItem}>
						<ListItemIcon sx={styles.listItemIcon}>
							<feature.Icon />
						</ListItemIcon>
						<ListItemText
							primary={feature.title}
							secondary={feature.description}
							primaryTypographyProps={{ style: styles.listItemTextPrimary }}
							secondaryTypographyProps={{ style: styles.listItemTextSecondary }}
						/>
					</ListItem>
				))}
			</List>
		</Box>
	);
};

export default FeatureList;
