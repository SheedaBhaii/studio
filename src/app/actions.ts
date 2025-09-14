
'use server';

import {
  recommendPCConfiguration,
  type RecommendPCConfigurationOutput,
} from '@/ai/flows/pc-decision-gen-ai';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// --- PC Recommendation Action ---

const pcFormSchema = z.object({
  softwareRequirements: z.string().min(10, {
    message: 'Please describe the software you use in a bit more detail.',
  }),
  gameRequirements: z.string().min(10, {
    message: 'Please describe the games you play in a bit more detail.',
  }),
  photoDataUri: z.string().optional(),
});

export async function getPCRecommendation(
  prevState: any,
  formData: FormData
): Promise<{
  message: string;
  recommendation?: RecommendPCConfigurationOutput;
  errors?: any;
}> {
  const validatedFields = pcFormSchema.safeParse({
    softwareRequirements: formData.get('softwareRequirements'),
    gameRequirements: formData.get('gameRequirements'),
    photoDataUri: formData.get('photoDataUri'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please fix the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await recommendPCConfiguration(validatedFields.data);
    return { message: 'success', recommendation: result };
  } catch (error) {
    console.error(error);
    return { message: 'An unexpected error occurred. Please try again.' };
  }
}


// --- Contact Form Action ---

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export async function submitContactForm(prevState: any, formData: FormData) {
  const validatedFields = contactFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Please fix the errors below.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Here you would typically send an email or save to a database.
  // For this demo, we'll just simulate a success response.
  console.log('Contact form submitted:', validatedFields.data);
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  revalidatePath('/support');
  return { message: 'Thank you for your message! We will get back to you shortly.' };
}
