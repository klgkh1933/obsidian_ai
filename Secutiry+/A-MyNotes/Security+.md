# Principles
[From](https://www.youtube.com/watch?v=RZnprQW-3Ac&list=PLKOHyT8e8FEw&index=1)
CIA Triad:
- Confidentiality 
	- Only the right people
	- Encryption
	- Access control
- Integrity 
	- No unauthorized change
	- Hashing
		- Temper-evident seal 
- Availability 
	- Up when you need it
	- Backups, redundancy
	- Failover, patching
DAD Triad:
- Disclosure <> failure of CIA.Confidentiality
- Alteration <> failure of CIA.Integrity
- Destruction <> failure of CIA.Availability
Third
- Authenticity
- Non-repudiation
	- Can't deny it
	- Digital signature
		- Serves: Authenticity and Non-repudiation
- Accountability
	- Trace actions to people
	- Every action logged
	- Logging
- 
AAA:
- Authentication
	- Who are you?
	- Password, token
- Authorization
	- What may you do?
	- Permission
- Accounting
	- What did you do?
	- Audit log 
	- 
>- Authentication + Authorization => Confidentiality
>- Authorization => Integrity
>- Accounting => Accountability, non-repudiation
>
> Triple A: the machinery
> CIA: the goal

Zero trust principles 
- Verify explicitly
	- Prove who is asking
	- Device healthy?
- Verify continuously
	- No one-time stamp
	- Recheck often
- Least privilege
	- Only what you need
	- s
- Assume breach
