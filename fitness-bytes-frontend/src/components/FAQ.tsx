import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Typography,
} from "@mui/material";

const faqs = [
	{
		question: "How do I sign up for FitnessBytes?",
		answer:
			'Just click on the "Join Now" button and fill out the registration form to get started.',
	},
	{
		question: "Is FitnessBytes free to use?",
		answer:
			"Yes, FitnessBytes is free for all fitness enthusiasts and professionals.",
	},
	{
		question: "How do I connect with a personal trainer or dietitian?",
		answer:
			"Search for them by name, add them as a friend, and send them a direct message! Additionally, you can discover personal trainers and dietitians by exploring posts on the platform. Find a post that resonates with you and reach out to the author directly.",
	},

	{
		question: "How do I adjust my notification settings?",
		answer:
			"You can customize your notifications by going to the account settings, this accessible via the drop down in the top right corner while signed in.",
	},
	{
		question: "Can I share my FitnessBytes posts on other social media?",
		answer:
			"Yes, you can share your achievements and posts on other social media platforms directly from FitnessBytes, by using the sharing button attached to every post!",
	},
];

const FAQ = ({ id }: { id: string }) => {
	return (
		<Box
			id={id}
			width={"100%"}
			maxWidth={"800px"}
			margin={"auto"}
			padding={5}>
			<Typography
				margin={"auto"}
				component={"h2"}
				variant="h3"
				letterSpacing={"-.17rem"}
				marginBottom={4}>
				Common Questions
			</Typography>
			{faqs.map((faq, index) => (
				<Accordion key={index} sx={{ padding: 2, margin: 2 }}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon />}
						aria-controls={`panel${index}a-content`}
						id={`panel${index}a-header`}>
						<Typography>{faq.question}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography>{faq.answer}</Typography>
					</AccordionDetails>
				</Accordion>
			))}
		</Box>
	);
};

export default FAQ;
