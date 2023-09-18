## Guide: Self-hosted Supabase

Table of Contents
1. Running Supabase Locally
2. Creating Tables and Dummy Data
3. Connecting Your Application to the Running Supabase Server


### 1. Running Supabase Locally
Before starting, make sure you have Docker installed on your machine as Supabase uses it to spin up the necessary containers.

Steps:

Navigate to the Docker Directory:

`cd docker`

Copy the fake env vars, you can adjust it as needed:

`cp .env.example .env`

Pull the latest images:

`docker compose pull`

As 16th September 2023, you need to fix supabase-vector issue :
>Edit /docker/volumes/logs/vector.yml, line 156 to .metadata.parsed.error_severity = upcase!(.metadata.parsed.error_severity) (adding the ! after "upcase")

Start the services (in detached mode) :

`docker compose up -d`

Once running, you can access the Supabase Studio at http://localhost:8000.

Main reference : https://supabase.com/docs/docs/guides/self-hosting/docker

### 2. Creating Tables and Dummy Data
Before starting, make sure supabase-service.json already match your configuration, simply check your .env inside docker folder or follow below instruction. 
1. Go to the Database settings for your project in the Supabase Dashboard.
2. Under Connection Info, copy the Host string and replace the entry in your supabase-service.json file.
3. Enter the password you used when you created your Supabase project in the password entry in the supabase-service.json file.

A. Run below command inside supabase folder :

`node json2supabase.js workflow_results.json firestore_id`

and

`node json2supabase.js llm_outputs.json firestore_id`

If above command fails or takes so long, you can simply delete generated table via supabase studio and rerun the command.

B. Run sql query in supabaseTableAdjustment.sql file via supabase studio SQL Editor. Run for both "workflow_results" and "llm_outputs", please adjust the table name in the sql. Running this sql is needed to swap timestamp type in firestore to timestamp in postgres.

Main reference : https://supabase.com/docs/guides/resources/migrating-to-supabase/firestore-data

### 3. Connecting Your Application to the Running Supabase Server
Get Supabase URL and API Key:

Your Supabase URL will be http://localhost:8000 if you're running it locally.
Your API key can be obtained from the settings section of the Supabase Studio.

1. Go to API Docs page
2. Select Authentication under Getting Started section
3. Click bash button on top right corner and change key visibility
4. Copy the displayed key

Paste the url and key into your .env.local (on root folder) :

VITE_SUPABASE_URL=

VITE_SUPABASE_KEY=

On dev server, the vite application will restart automatically.