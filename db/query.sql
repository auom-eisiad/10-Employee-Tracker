SELECT *
FROM job
JOIN employee ON job.id = employee.job_id;