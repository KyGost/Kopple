# Concepts
## Querying the tree
Querying the tree is how the client gets data from other clients.

Each client has an address. This address is where their data is stored. One of the pieces of data stored is the [`follows`](follows.md) file; this file lists other users.

We can keep querying any addresses we find in this "crawl", until we are happy. The distance we go is mesured in steps from self to end. One step is one address.  
If a thread were to start at self, go to a following addess, go to that one of that address' following
<!--stackedit_data:
eyJoaXN0b3J5IjpbLTI2ODM0MTEzN119
-->