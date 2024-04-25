import { Box, Button, Divider, Grid, Stack, Typography } from "@mui/material";
import darkImage from "../assets/Hero - 1 - Dark - fixed.png";
import lightImage from "../assets/Hero - 2- light -png.png";
import community from "../assets/community-engagement.webp";
import exclusivity from "../assets/exclusivity-fitness.webp";
import professional from "../assets/professional-networking.webp";
import FAQ from "../components/FAQ";
import FeatureList from "../components/FeatureList";
import LogoName from "../components/LogoName";
import useThemeStore from "../hooks/useThemeStore";

const Welcome = () => {
	const mode = useThemeStore((s) => s.mode);

	return (
		<Stack>
			<Box
				component={"img"}
				src={mode === "light" ? lightImage : darkImage}
				alt="Hero Section image for Fitness Bytes"
			/>
			<Stack
				id="about"
				padding={10}
				bgcolor={"secondary.dark"}
				paddingX={5}
				gap={5}>
				<Typography
					maxWidth={"800px"}
					margin={"auto"}
					component={"h2"}
					variant="h3"
					letterSpacing={"-.05rem"}>
					Our Mission
				</Typography>
				<Typography
					maxWidth={"800px"}
					margin={"auto"}
					padding={1.4}
					variant="body2"
					lineHeight={"2rem"}
					letterSpacing={".1rem"}>
					At FitnessBytes, we are dedicated to fostering a distraction-free
					environment where fitness enthusiasts and professionals can thrive.
					Our mission is to empower our community to stay focused on their
					fitness goals, providing a platform where motivation and information
					flow freely without the clutter of everyday social media. Here, every
					feature and interaction is designed to support your journey towards
					personal and professional fitness success.
				</Typography>
			</Stack>
			<Grid container bgcolor={"primary.dark"}>
				<Grid item xs={12} lg={4}>
					<Stack
						display={{ sx: "flex", lg: "block" }}
						flexDirection={{ xs: "column", sm: "row" }}
						paddingY={10}
						paddingX={5}
						gap={5}>
						<Stack maxWidth={"800px"} margin={"auto"}>
							<Typography
								letterSpacing={"-.07rem"}
								component={"h3"}
								variant="h4">
								Exclusivity in Fitness
							</Typography>
							<Box
								margin={"auto"}
								width={"300px"}
								component={"img"}
								sx={{ objectFit: "fill" }}
								paddingY={4}
								alt="Exclusivity-Image"
								src={exclusivity}></Box>
						</Stack>
						<Stack maxWidth={"800px"} margin={"auto"}>
							<Typography
								margin={"auto"}
								lineHeight={"2rem"}
								letterSpacing={".1rem"}
								variant="body2"
								textAlign={"center"}>
								FitnessBytes is tailored specifically for the fitness community.
								We provide a specialized space that prioritizes health,
								wellness, and fitness content over all else, ensuring that every
								interaction adds value to your fitness journey.
							</Typography>
						</Stack>
					</Stack>
				</Grid>
				<Grid item xs={12} lg={4}>
					<Stack
						display={{ sx: "flex", lg: "block" }}
						flexDirection={{ xs: "column", sm: "row-reverse" }}
						paddingY={10}
						paddingX={5}
						gap={5}>
						<Stack maxWidth={"800px"} margin={"auto"}>
							<Typography
								letterSpacing={"-.07rem"}
								component={"h3"}
								variant="h4">
								Professional Networking
							</Typography>
							<Box
								margin={"auto"}
								width={"300px"}
								component={"img"}
								sx={{ objectFit: "fill" }}
								paddingY={4}
								alt="professional-networking-Image"
								src={professional}></Box>
						</Stack>
						<Stack maxWidth={"800px"} margin={"auto"}>
							<Typography
								margin={"auto"}
								lineHeight={"2rem"}
								letterSpacing={".1rem"}
								variant="body2"
								textAlign={"center"}>
								We understand the power of connection. Our platform serves as a
								springboard for fitness professionals, including personal
								trainers, dietitians, and influencers, to expand their influence
								and client base through meaningful networking opportunities.
							</Typography>
						</Stack>
					</Stack>
				</Grid>
				<Grid item xs={12} lg={4}>
					<Stack
						display={{ sx: "flex", lg: "block" }}
						flexDirection={{ xs: "column", sm: "row" }}
						paddingY={10}
						paddingX={5}
						gap={5}>
						<Stack maxWidth={"800px"} margin={"auto"}>
							<Typography
								letterSpacing={"-.07rem"}
								component={"h3"}
								variant="h4">
								Community Engagement
							</Typography>
							<Box
								margin={"auto"}
								width={"300px"}
								component={"img"}
								sx={{ objectFit: "fill" }}
								paddingY={4}
								alt="professional-networking-Image"
								src={community}></Box>
						</Stack>
						<Stack maxWidth={"800px"} margin={"auto"}>
							<Typography
								margin={"auto"}
								lineHeight={"2rem"}
								letterSpacing={".1rem"}
								variant="body2"
								textAlign={"center"}>
								At the heart of FitnessBytes is a vibrant, supportive community.
								We encourage active engagement through features that promote
								mutual support, motivation, and accountability among members,
								fostering a positive and productive fitness environment.
							</Typography>
						</Stack>
					</Stack>
				</Grid>
			</Grid>
			<FeatureList id="features" />
			<Box paddingY={5}>
				<FAQ id="faqs" />
			</Box>
			<Stack paddingY={10} gap={5}>
				<LogoName center></LogoName>
				<Typography
					textAlign={"center"}
					lineHeight={"2rem"}
					letterSpacing={"-.05rem"}
					paddingX={3}
					variant={"h5"}>
					Ready to elevate your fitness journey?
				</Typography>
				<Stack margin={"auto"}>
					<Stack gap={3} width={"75vw"} maxWidth={"700px"}>
						<Button href="/signup" size="large" variant="contained">
							Join Now
						</Button>
						<Button
							href="/login"
							size="large"
							color="secondary"
							variant="outlined">
							Log in
						</Button>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default Welcome;
