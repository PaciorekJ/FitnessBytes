import { PaletteMode, createTheme, responsiveFontSizes } from "@mui/material";

const colors = {
	darkBlue: "#010110",
	lightGreenishWhite: "#f1fbef",
	vibrantOrange: "#f47227",
	teal: "#11b4bd",
	navyBlue: "#163a63",
	white: "#FFFFFF",
};

// Create a theme instance
const lightTheme = {
	palette: {
        primary: {
			main: colors.navyBlue, // Used for primary buttons and links
			contrastText: colors.lightGreenishWhite, // Text color for primary buttons
		},
		secondary: {
			main: colors.teal, // Used for secondary buttons and accents
			contrastText: colors.darkBlue, // Text color for secondary buttons
		},
		accent: {
			main: colors.vibrantOrange,
			contrastText: colors.lightGreenishWhite,
		},
		error: {
			main: colors.vibrantOrange, // Used for error states and icons
		},
		background: {
			default: colors.lightGreenishWhite, // Replace with the hex color code for the page background
			paper: colors.lightGreenishWhite, // Replace with the hex color code for the background of paper elements
		},
		text: {
			primary: colors.darkBlue, // Primary text color
			secondary: colors.navyBlue,
		},
	},
};

const darkTheme = {
	palette: {
		primary: {
			main: "#0A3A60", // Darker shade of navy blue for primary elements
			contrastText: "#E0F7FA", // Lighter shade for text on primary elements
		},
		secondary: {
			main: "#008080", // Adjusted shade of teal for dark mode
			contrastText: "#CAF0F8", // Lighter shade of dark blue for better contrast
		},
		accent: {
			main: "#FFA500", // Keeping vibrant orange, as it can still stand out in dark mode
			contrastText: "#E0F7FA", // Ensuring contrast with accent elements
		},
		error: {
			main: "#FF6347", // Using a tomato red for errors to ensure visibility
		},
		background: {
			default: "#121212", // Dark gray for the main background
			paper: "#1E1E1E", // Slightly lighter gray for paper elements
		},
		text: {
			primary: "#E0F7FA", // Light cyan for primary text to stand out against the dark background
			secondary: "#B2EBF2", // Slightly dimmer for secondary text
			disabled: "#9E9E9E"
		},
	},
    components: {
        MuiButton: {
          styleOverrides: {
            root: {
				"&.Mui-disabled": {
				background: "#LLLLLL",
				color: "#FFFFFF",
				},
            }
          }
        },
      }
};

const getTheme = (mode: PaletteMode) => {
	let theme = createTheme((mode === "light") ? lightTheme : darkTheme);
    theme = responsiveFontSizes(theme);

	theme.components = {
		...theme.components,
		MuiButton: {
            styleOverrides: {
                sizeLarge: {
                    padding: "1em",
                    "&.Mui-disabled": mode === "light" ? "": {
                        background: theme.palette.primary.light,
                        color: theme.palette.text.disabled
                    }
				},
			},
		},
		MuiSvgIcon: {
			styleOverrides: {
				root: {
					color: mode === "light" ? "" : theme.palette.secondary.main,
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: mode === "light" ? "" : theme.palette.text.secondary,
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					borderColor: mode === "light" ? "" : theme.palette.primary.dark,
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					borderRadius: "5px",
					borderColor: mode === "light" ? "" : theme.palette.text.secondary,
				},
			},
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    border: mode === "light" ? "" : "1px solid",
                    borderColor: mode === "light" ? "" : theme.palette.text.secondary,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    border: "none",
                    borderColor: "none",
                },
            },
        },
	};

	return theme;
};

export default getTheme;