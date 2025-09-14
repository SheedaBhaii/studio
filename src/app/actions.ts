
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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
