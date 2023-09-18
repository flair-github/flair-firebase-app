-- First
alter table workflow_results
add column created_at timestamp with time zone;

-- Second
update workflow_results
set
  created_at = (
    -- Convert the _seconds part into a TIMESTAMP
    timestamp '1970-01-01 00:00:00 UTC' + interval '1 SECOND' * ("createdTimestamp" ->> '_seconds')::bigint
    -- Add the _nanoseconds part
    + interval '1 MICROSECOND' * (
      ("createdTimestamp" ->> '_nanoseconds')::bigint / 1000
    )
  );

-- Third
alter table workflow_results
drop column "createdTimestamp";

-- Fourth
alter table workflow_results
rename column created_at to "createdTimestamp";