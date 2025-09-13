import { Dimensions } from 'react-native';
import COLORS from './colors';

const { width, height } = Dimensions.get('window');

/**
 * App theme constants
 */
export default {
  // Dimensions
  SCREEN_WIDTH: width,
  SCREEN_HEIGHT: height,
  
  // Spacing
  SPACING_XS: 4,
  SPACING_SM: 8,
  SPACING_MD: 16,
  SPACING_LG: 24,
  SPACING_XL: 32,
  
  // Typography
  FONT_SIZE_XS: 12,
  FONT_SIZE_SM: 14,
  FONT_SIZE_MD: 16,
  FONT_SIZE_LG: 18,
  FONT_SIZE_XL: 20,
  FONT_SIZE_XXL: 24,
  
  // Border radius
  BORDER_RADIUS_SM: 4,
  BORDER_RADIUS_MD: 8,
  BORDER_RADIUS_LG: 12,
  BORDER_RADIUS_XL: 16,
  BORDER_RADIUS_CIRCLE: 999,
  
  // Shadows for iOS
  SHADOW_LIGHT: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  SHADOW_MEDIUM: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  SHADOW_HEAVY: {
    shadowColor: COLORS.SHADOW,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  
  // Elevation for Android
  ELEVATION_LIGHT: 2,
  ELEVATION_MEDIUM: 4,
  ELEVATION_HEAVY: 8,
};
