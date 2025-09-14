# Supabase Authentication Setup Guide

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new account if you don't have one
2. Create a new project
3. Wait for the project to be set up

## 2. Get Your Credentials

1. Go to your project dashboard
2. Click on "Settings" in the sidebar
3. Click on "API" 
4. Copy your:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (starts with `eyJhbGciOiJIUzI1NiIs...`)

## 3. Configure Your Environment

1. Create a `.env.local` file in your `OKS` directory
2. Add your Supabase credentials:

```env
VITE_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Set Up Authentication (Optional)

### Email Templates (Recommended)
1. Go to Authentication > Email Templates in your Supabase dashboard
2. Customize the email templates for:
   - Confirm signup
   - Reset password
   - Magic link

### Authentication Settings
1. Go to Authentication > Settings
2. Configure:
   - Site URL: `http://localhost:5173` (for development)
   - Redirect URLs: Add your production URL when ready

## 5. Database Setup (Optional)

If you want to store additional user profile information:

```sql
-- Create a profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  first_name text,
  last_name text,
  phone text,
  avatar_url text,
  
  constraint first_name_length check (char_length(first_name) >= 1)
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a trigger to automatically create a profile entry when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 6. Test Your Setup

1. Start your development server: `npm run dev`
2. Go to the login page
3. Try creating a new account
4. Check your Supabase dashboard to see if users are being created

## Features Implemented

✅ **Login with Email/Password**
- Real-time form validation
- Proper error handling for various scenarios
- Success messages and redirects

✅ **Password Reset**
- Click "Forgot password?" on login page
- Enter email to receive reset link

✅ **Registration** (Ready to implement)
- User signup with email verification
- Additional profile fields

✅ **Authentication State Management**
- Persistent sessions across page reloads
- Real-time auth state updates
- Automatic token refresh

## Next Steps

1. Update the registration page to use Supabase
2. Update the navbar to show real authentication state
3. Protect routes that require authentication
4. Add user profile management

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Check that your environment variables are set correctly
2. **CORS errors**: Make sure your site URL is configured in Supabase settings
3. **Email not sending**: Check your email templates and SMTP settings in Supabase
4. **Users not created**: Check the browser console for error messages

### Debug Mode:

Add this to see auth state changes in console:
```javascript
// In your browser console
localStorage.setItem('supabase.auth.debug', 'true')
```