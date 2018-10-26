VERSION=$1

composer network install -a pemilu-network@$VERSION.bna -c PeerAdmin@byfn-network-jatim

composer network install -a pemilu-network@$VERSION.bna -c PeerAdmin@byfn-network-jabar

composer network upgrade -c PeerAdmin@byfn-network-jabar -n pemilu-network -V $VERSION -A alice -C alice/admin-pub.pem -A bob -C bob/admin-pub.pem

