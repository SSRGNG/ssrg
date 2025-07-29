import { CHART_COLOR_PALETTES } from "@/config/constants";
import { generateOKLCHColor } from "@/lib/utils";

/**
 * Generates a standardized key from a display label.
 * Used for consistent key generation in chart data and configuration objects.
 *
 * @param label - The full display label (e.g., "Medical Expenses")
 * @returns A normalized key suitable for chart configurations (e.g., "medical-expenses")
 *
 * @example
 * ```typescript
 * getChartKey("Medical Expenses") // returns "medical-expenses"
 * ```
 *
 * @remarks
 * This function:
 * - Takes a multi-word display label
 * - Converts it to lowercase
 * - Replaces spaces with hyphens
 * - Removes special characters
 * - Used for creating consistent keys between chartData and chartConfig objects
 */
export function getChartKey(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Generic type for chart data entries
 * @template TValue - Type of the value (number, string, etc.)
 * @template TDataKey - Type of the key used for the data value (default 'dataKey')
 * @template TNameKey - Type of the key used for name/category identifier (default 'nameKey')
 */
export type ChartDataEntry<
  TValue = number,
  TDataKey extends string = "dataKey",
  TNameKey extends string = "nameKey"
> = {
  /** The key used for matching with config */
  [K in TNameKey]: string;
} & {
  /** The data value with custom key */
  [K in TDataKey]: TValue;
  // /** The display label */
  // label: string;
  // /** CSS variable for the fill color */
  // fill: string;
};

/**
 * Configuration for creating chart data
 * @template TValue - Type of the value
 */
export type ChartDataConfig = {
  /** Key to use for the value in the output (e.g., 'dataKey', 'amount', etc.) */
  dataKey: string;
  /** Key to use for the name/category identifier in the output (e.g., 'nameKey', 'category', etc.) */
  nameKey: string;
};

/**
 * Creates chart data with configurable keys
 *
 * @param data - Array of data items
 * @param getLabelFn - Function to get the display label from a data item
 * @param getValueFn - Function to get the value from a data item
 * @param config - Configuration for key names
 *
 * @returns Array of chart data entries with properly typed keys and values
 *
 * @example
 * ```typescript
 * // For expenses chart
 * const expenseData = createChartData(
 *   expenses,
 *   (item) => item.name,
 *   (item) => item.amount,
 *   { dataKey: 'amount', nameKey: 'category' }
 * );
 *
 * // For demographics chart
 * const demographicData = createChartData(
 *   demographics,
 *   (item) => item.group,
 *   (item) => item.count,
 *   { dataKey: 'value', nameKey: 'segment' }
 * );
 * ```
 */
export function createChartData<T, TValue>(
  data: T[],
  getLabelFn: (item: T) => string,
  getValueFn: (item: T) => TValue,
  config: ChartDataConfig = {
    dataKey: "value",
    nameKey: "name",
  }
): ChartDataEntry<TValue, typeof config.dataKey, typeof config.nameKey>[] {
  return data.map((item) => {
    const label = getLabelFn(item);
    const key = getChartKey(label);

    return {
      [config.nameKey]: key,
      [config.dataKey]: getValueFn(item),
      label,
      fill: `var(--color-${key})`,
    } as ChartDataEntry<TValue, typeof config.dataKey, typeof config.nameKey>;
  });
}

/**
 * Type for chart configuration entries
 */
export type ChartConfigEntry = {
  /** Display label for the series */
  label: string;
  /** CSS color value - required for series entries */
  color?: string;
};

/**
 * Configuration for creating chart config
 */
export type ChartConfigOptions = {
  /** Include a config for the value (e.g., amount, value, etc.) */
  includeDataKeyConfig?: boolean;
  /** Key to use for the value config */
  dataKey?: string;
  /** Label to use for the value config */
  dataKeyLabel?: string;
  /** Custom color palette variable prefix (default: --chart-) */
  colorPrefix?: string;
  /** Number of colors in the palette (default: 5) */
  paletteSize?: number;
  /** Color mode (default: css-vars) */
  colorMode?: "css-vars" | "direct" | "generated";
  /** Color palette (default: default) */
  palette?: "default" | "vibrant" | "muted";
};

/**
 * Creates a chart configuration object with configurable options
 *
 * @param data - Array of data items
 * @param getLabelFn - Function to get the display label from a data item
 * @param options - Configuration options
 *
 * @example
 * ```typescript
 * // With value config
 * const expenseConfig = createChartConfig(
 *   expenses,
 *   (item) => item.name,
 *   {
 *     includeDataKeyConfig: true,
 *     dataKey: 'amount',
 *     dataKeyLabel: 'Amount'
 *   }
 * );
 *
 * // With custom color palette
 * const demographicConfig = createChartConfig(
 *   demographics,
 *   (item) => item.group,
 *   {
 *     colorPrefix: '--demographic-',
 *     paletteSize: 8
 *   }
 * );
 * ```
 */
export function createChartConfig<T>(
  data: T[],
  getLabelFn: (item: T) => string,
  options: ChartConfigOptions = {}
): Record<string, ChartConfigEntry> {
  const {
    includeDataKeyConfig = true,
    dataKey = "value",
    dataKeyLabel = "Value",
    colorPrefix = "--chart-",
    paletteSize = 5,
    colorMode = "css-vars",
    palette = "default",
  } = options;

  const config: Record<string, ChartConfigEntry> = {};

  // Add value config if requested
  if (includeDataKeyConfig) {
    config[dataKey] = { label: dataKeyLabel };
  }

  // Generate colors based on mode
  const getColor = (index: number): string => {
    switch (colorMode) {
      case "css-vars":
        return `var(${colorPrefix}${(index % paletteSize) + 1})`;

      case "direct":
        const selectedPalette = CHART_COLOR_PALETTES[palette];
        if (index < selectedPalette.length) {
          return selectedPalette[index];
        }
        // Fall back to generated colors if we exceed predefined palette
        return generateOKLCHColor(index, data.length);

      case "generated":
        return generateOKLCHColor(index, data.length);

      default:
        return generateOKLCHColor(index, data.length);
    }
  };

  // Add series configs
  data.forEach((item, index) => {
    const label = getLabelFn(item);
    config[getChartKey(label)] = {
      label,
      color: getColor(index),
    };
  });

  return config;
}
