/**
 * Normalizes an author name for comparison by:
 * - Converting to lowercase
 * - Removing common punctuation
 * - Normalizing whitespace
 * - Handling common academic title prefixes/suffixes
 */
function normalizeAuthorName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^(dr\.?|prof\.?|professor|mr\.?|ms\.?|mrs\.?)\s+/i, "") // Remove titles
    .replace(/\s+(jr\.?|sr\.?|ii|iii|iv|phd|md|dsc|bsc|msc)\.?$/i, "") // Remove suffixes
    .replace(/[.,\-'"`]/g, " ") // Replace punctuation with spaces
    .replace(/\s+/g, " ") // Normalize multiple spaces to single space
    .trim();
}

/**
 * Calculates similarity between two normalized author names using multiple techniques:
 * - Jaccard similarity on name parts
 * - Bonuses for matching first/last names
 * - Handling of initials vs full names
 * - Detection of name reordering
 */
function calculateNameSimilarity(name1: string, name2: string): number {
  if (!name1 || !name2) return 0;
  if (name1 === name2) return 1.0;

  // Split names into parts and filter out empty strings
  const parts1 = name1.split(" ").filter((part) => part.length > 0);
  const parts2 = name2.split(" ").filter((part) => part.length > 0);

  if (parts1.length === 0 || parts2.length === 0) return 0;

  // Handle initials and expand them for better matching
  const expandedParts1 = expandInitials(parts1);
  const expandedParts2 = expandInitials(parts2);

  // Calculate Jaccard similarity coefficient
  const jaccardSimilarity = calculateJaccardSimilarity(
    expandedParts1,
    expandedParts2
  );

  // Bonus scoring for specific matches
  let bonusScore = 0;

  // First name match bonus (20% weight)
  if (
    expandedParts1[0] &&
    expandedParts2[0] &&
    isNamePartMatch(expandedParts1[0], expandedParts2[0])
  ) {
    bonusScore += 0.2;
  }

  // Last name match bonus (20% weight)
  if (expandedParts1.length > 0 && expandedParts2.length > 0) {
    const lastName1 = expandedParts1[expandedParts1.length - 1];
    const lastName2 = expandedParts2[expandedParts2.length - 1];
    if (isNamePartMatch(lastName1, lastName2)) {
      bonusScore += 0.2;
    }
  }

  // Name reordering bonus (10% weight)
  if (checkNameReordering(expandedParts1, expandedParts2)) {
    bonusScore += 0.1;
  }

  // Middle name/initial matching bonus
  if (hasMiddleNameMatch(expandedParts1, expandedParts2)) {
    bonusScore += 0.1;
  }

  // Cap the total score at 1.0
  return Math.min(1.0, jaccardSimilarity + bonusScore);
}

/**
 * Expands initials and normalizes name parts for better matching
 */
function expandInitials(nameParts: string[]): string[] {
  return nameParts.map((part) => {
    // Handle initials (single letter, optionally with period)
    if (part.length === 1 || (part.length === 2 && part.endsWith("."))) {
      return part.replace(".", "").toLowerCase();
    }
    // Handle hyphenated names
    if (part.includes("-")) {
      return part
        .split("-")
        .map((subPart) => subPart.trim())
        .join("");
    }
    return part.toLowerCase();
  });
}

/**
 * Calculates Jaccard similarity between two arrays of name parts
 */
function calculateJaccardSimilarity(
  parts1: string[],
  parts2: string[]
): number {
  const set1 = new Set(parts1);
  const set2 = new Set(parts2);

  // Calculate intersection
  const intersection = new Set([...set1].filter((part) => set2.has(part)));

  // Calculate union
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) return 0;

  return intersection.size / union.size;
}

/**
 * Checks if two name parts match, considering initials
 */
function isNamePartMatch(part1: string, part2: string): boolean {
  if (part1 === part2) return true;

  // Check if one is an initial of the other
  if (part1.length === 1 && part2.length > 1) {
    return part2.startsWith(part1);
  }
  if (part2.length === 1 && part1.length > 1) {
    return part1.startsWith(part2);
  }

  // Check for common nickname/formal name pairs
  const nicknames: Record<string, string[]> = {
    william: ["bill", "will", "billy"],
    robert: ["bob", "rob", "bobby"],
    richard: ["rick", "dick", "richie"],
    james: ["jim", "jimmy", "jamie"],
    michael: ["mike", "mick", "mickey"],
    christopher: ["chris", "kit"],
    alexander: ["alex", "sandy"],
    elizabeth: ["liz", "beth", "betty", "libby"],
    katherine: ["kate", "kathy", "katie", "kitty"],
    margaret: ["maggie", "meg", "peggy"],
  };

  for (const [formal, nicks] of Object.entries(nicknames)) {
    if (
      (part1 === formal && nicks.includes(part2)) ||
      (part2 === formal && nicks.includes(part1))
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Checks if the name parts represent a reordering (e.g., "John Smith" vs "Smith John")
 */
function checkNameReordering(parts1: string[], parts2: string[]): boolean {
  if (parts1.length !== parts2.length || parts1.length < 2) return false;

  // Sort both arrays and compare
  const sorted1 = [...parts1].sort();
  const sorted2 = [...parts2].sort();

  return JSON.stringify(sorted1) === JSON.stringify(sorted2);
}

/**
 * Checks for middle name or middle initial matches
 */
function hasMiddleNameMatch(parts1: string[], parts2: string[]): boolean {
  if (parts1.length < 3 || parts2.length < 3) return false;

  // Get middle parts (excluding first and last)
  const middle1 = parts1.slice(1, -1);
  const middle2 = parts2.slice(1, -1);

  // Check for any overlap in middle names/initials
  for (const m1 of middle1) {
    for (const m2 of middle2) {
      if (isNamePartMatch(m1, m2)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Main function to find the best matching author from a list
 */
function findBestAuthorMatch(
  inputName: string,
  candidateAuthors: Array<{ id: string; name: string; affiliation?: string }>,
  threshold: number = 0.85
): {
  author: { id: string; name: string; affiliation?: string };
  score: number;
} | null {
  const normalizedInput = normalizeAuthorName(inputName);
  let bestMatch = null;
  let bestScore = 0;

  for (const author of candidateAuthors) {
    const normalizedCandidate = normalizeAuthorName(author.name);
    const similarity = calculateNameSimilarity(
      normalizedInput,
      normalizedCandidate
    );

    if (similarity > bestScore && similarity >= threshold) {
      bestScore = similarity;
      bestMatch = author;
    }
  }

  return bestMatch ? { author: bestMatch, score: bestScore } : null;
}

// Export the functions
export { calculateNameSimilarity, findBestAuthorMatch, normalizeAuthorName };
