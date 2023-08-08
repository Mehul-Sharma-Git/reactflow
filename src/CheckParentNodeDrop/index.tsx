const checkParentNodeDrop = (newNode: any, nodes: any, setNodes: any) => {
	const isDropOnParentNode = nodes.find((node: any) => {
		if (
			node.type === 'parentGroup' &&
			newNode.position.x >= node.position.x &&
			newNode.position.x <= node.position.x + node.width &&
			newNode.position.y >= node.position.y &&
			newNode.position.y <= node.position.y + node.height
		) {
			// newNode.position.x = newNode.position.x - node.position.x;
			// newNode.position.y = newNode.position.y - node.position.y;
			newNode.position.x = 10;

			newNode.position.y = node.nodes ? node.nodes.length * 42 + 41 : 41;
			return node;
		}
	});

	if (isDropOnParentNode) {
		const { position, output, parentNode, ...childNode } = newNode;
		setNodes((nds: any) =>
			nds.map((node: any) => {
				if (node.id === isDropOnParentNode.id) {
					const foundNode = node.nodes.find((node: any) => {
						return node.id === childNode.id;
					});
					if (!foundNode) {
						node.nodes.push(childNode);
					}
				}

				return node;
			})
		);
		newNode.parentNode = isDropOnParentNode.id;
		newNode.extent = 'parent';
		// newNode.draggable= isDropOnParentNode ? false : true;
		newNode.hidden = true;
	}

	return newNode;
};

export default checkParentNodeDrop;
