# Client
KyWeb is designed for use on Beaker's Hyperdrive protocol.

For each client, a new hyperdrive should be created and shared. This will serve as the data store, identification and frontend.

## Interface
The interface starts at the feed. The feed is a list of posts from addresses that the client has listed in [`follows`](follows.md). These posts are gathered from the [address](adress.md)es' [`feed`](feed.md) files.  
Posts are then filtered based on the address' filters (see [filters](filters.md) for more).  
After filtering, interactions are added, these are gathered from the client's [`interactions`](interactions.md), [`follows`](follows.md)' addresses' [`interactions`](interactions.md), their [`follows`](follows.md)' addresses' [`interactions`](interactions.md) and so on.  
The level of following to do is ideally set by a settings option, defaults to 3 (self, following, following, following).  

```mermaid
graph TD;
	self-->A;
	self-->B;
	self-->C;
	A-->D;
	A-->E;
	B-->F;
	B-->G;
	C-->H;
	C-->I;
	C-->J;
	D-->K;
	D-->L;
	D-->M;
	E-->N;
	E-->O;
	F-->P;
	F-->Q;
	F-->R;
	G-->S;
	G-->T;
	H-->U;
	H-->V;
	I-->W;
	I-->X;
	J-->Y;
	J-->Z;
```
![enter image description here](https://lh3.googleusercontent.com/pw/ACtC-3dIRO7vqORVtKok-LkgbemfzOLcYzOsLAp7x-7MfkyLan-vTMZ7b-2vFjOfnoEnMk1xDZ7EbVw6sW-VVCgPy9qaUkAaqx0fRe4tSJYmEQYx1sbkbsT-M20quRBw9hO-e2CQu_7u44UnJudXr9qXB91Diw=w1480-h436-no?authuser=0)
`self` would load [interactions](interactions.md) from `A`-`Z` but only [feeds](feeds.md) from `A`-`C`.

## Functioning
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTg2MzI5OTE3NiwtNzY4MDg4MDYsLTE1Nj
E1ODA4NTRdfQ==
-->