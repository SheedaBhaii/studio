
'use server';
/**
 * @fileOverview An AI agent that recommends a PC configuration based on software and game requirements.
 *
 * - recommendPCConfiguration - A function that takes software and game requirements as input and returns a recommended PC configuration.
 * - RecommendPCConfigurationInput - The input type for the recommendPCConfiguration function.
 * - RecommendPCConfigurationOutput - The return type for the recommendPCConfiguration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendPCConfigurationInputSchema = z.object({
  softwareRequirements: z
    .string()
    .describe('The software requirements for the PC configuration.'),
  gameRequirements: z
    .string()
    .describe('The game requirements for the PC configuration.'),
  photoDataUri: z
    .string()
    .optional()
    .describe(
      "An optional photo of the user's current setup or a specific piece of software, as a data URI."
    ),
});
export type RecommendPCConfigurationInput = z.infer<
  typeof RecommendPCConfigurationInputSchema
>;

const RecommendPCConfigurationOutputSchema = z.object({
  recommendedGPU: z.string().describe('The recommended GPU for the PC configuration.'),
  recommendedCPU: z.string().describe('The recommended CPU for the PC configuration.'),
  recommendedRAM: z.string().describe('The recommended RAM for the PC configuration.'),
  recommendedStorage: z
    .string()
    .describe('The recommended storage for the PC configuration.'),
  recommendedMonitor: z
    .string()
    .describe('The recommended monitor for the PC configuration.'),
  justification: z
    .string()
    .describe('The justification for the recommended configuration.'),
});
export type RecommendPCConfigurationOutput = z.infer<
  typeof RecommendPCConfigurationOutputSchema
>;

export async function recommendPCConfiguration(
  input: RecommendPCConfigurationInput
): Promise<RecommendPCConfigurationOutput> {
  return recommendPCConfigurationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendPCConfigurationPrompt',
  input: {schema: RecommendPCConfigurationInputSchema},
  output: {schema: RecommendPCConfigurationOutputSchema},
  prompt: `You are an expert PC building assistant. Based on the software, game requirements, and optional photo provided, you will recommend a PC configuration.

Software Requirements: {{{softwareRequirements}}}
Game Requirements: {{{gameRequirements}}}
{{#if photoDataUri}}
User's Photo: {{media url=photoDataUri}}
{{/if}}

Analyze the text and the image (if provided) to understand the user's needs. The image might show their current setup, a specific game, or a piece of design software. Use all available information to provide a tailored recommendation.

Provide a configuration including:
- recommendedGPU
- recommendedCPU
- recommendedRAM
- recommendedStorage
- recommendedMonitor
- justification`,
});

const recommendPCConfigurationFlow = ai.defineFlow(
  {
    name: 'recommendPCConfigurationFlow',
    inputSchema: RecommendPCConfigurationInputSchema,
    outputSchema: RecommendPCConfigurationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
