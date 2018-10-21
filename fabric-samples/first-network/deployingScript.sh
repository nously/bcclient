composer card delete -c PeerAdmin@byfn-network-jabar
composer card delete -c PeerAdmin@byfn-network-jatim

echo "INSERT_ORG1_CA_CERT: "
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' crypto-config/peerOrganizations/jatim.pemilu.com/peers/peer0.jatim.pemilu.com/tls/ca.crt > ./tmp/INSERT_ORG1_CA_CERT

echo "INSERT_ORG2_CA_CERT: "
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' crypto-config/peerOrganizations/jabar.pemilu.com/peers/peer0.jabar.pemilu.com/tls/ca.crt > ./tmp/INSERT_ORG2_CA_CERT

echo "INSERT_ORDERER_CA_CERT: "
awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' crypto-config/ordererOrganizations/pemilu.com/orderers/orderer.pemilu.com/tls/ca.crt > ./tmp/INSERT_ORDERER_CA_CERT


cat << EOF > ./byfn-network-jatim.json
{
    "name": "byfn-network",
    "x-type": "hlfv1",
    "version": "1.0.0",
	"client": {
		"organization": "Jatim",
		"connection": {
			"timeout": {
				"peer": {
					"endorser": "300",
					"eventHub": "300",
					"eventReg": "300"
				},
				"orderer": "300"
			}
		}
	},
    "channels": {
        "mychannel": {
            "orderers": [
                "orderer.pemilu.com"
            ],
            "peers": {
                "peer0.jatim.pemilu.com": {
                    "endorsingPeer": true,
                    "chaincodeQuery": true,
                    "eventSource": true
                },
                "peer1.jatim.pemilu.com": {
                    "endorsingPeer": true,
                    "chaincodeQuery": true,
                    "eventSource": true
                },
                "peer0.jabar.pemilu.com": {
                    "endorsingPeer": true,
                    "chaincodeQuery": true,
                    "eventSource": true
                },
                "peer1.jabar.pemilu.com": {
                    "endorsingPeer": true,
                    "chaincodeQuery": true,
                    "eventSource": true
                }
            }
        }
    },
    "organizations": {
        "Jatim": {
            "mspid": "JatimMSP",
            "peers": [
                "peer0.jatim.pemilu.com",
                "peer1.jatim.pemilu.com"
            ],
            "certificateAuthorities": [
                "ca.jatim.pemilu.com"
            ]
        },
        "Jabar": {
            "mspid": "JabarMSP",
            "peers": [
                "peer0.jabar.pemilu.com",
                "peer1.jabar.pemilu.com"
            ],
            "certificateAuthorities": [
                "ca.jabar.pemilu.com"
            ]
        }
    },
    "orderers": {
        "orderer.pemilu.com": {
            "url": "grpcs://localhost:7050",
            "grpcOptions": {
                "ssl-target-name-override": "orderer.pemilu.com"
            },
            "tlsCACerts": {
                "pem": "`cat ./tmp/INSERT_ORDERER_CA_CERT`"
            }
        }
    },
    "peers": {
        "peer0.jatim.pemilu.com": {
            "url": "grpcs://localhost:7051",
            "grpcOptions": {
                "ssl-target-name-override": "peer0.jatim.pemilu.com"
            },
            "tlsCACerts": {
                "pem": "`cat ./tmp/INSERT_ORG1_CA_CERT`"
            }
        },
        "peer1.jatim.pemilu.com": {
            "url": "grpcs://localhost:8051",
            "grpcOptions": {
                "ssl-target-name-override": "peer1.jatim.pemilu.com"
            },
            "tlsCACerts": {
                "pem": "`cat ./tmp/INSERT_ORG1_CA_CERT`"
            }
        },
        "peer0.jabar.pemilu.com": {
            "url": "grpcs://localhost:9051",
            "grpcOptions": {
                "ssl-target-name-override": "peer0.jabar.pemilu.com"
            },
            "tlsCACerts": {
                "pem": "`cat ./tmp/INSERT_ORG2_CA_CERT`"
            }
        },
        "peer1.jabar.pemilu.com": {
            "url": "grpcs://localhost:10051",
            "grpcOptions": {
                "ssl-target-name-override": "peer1.jabar.pemilu.com"
            },
            "tlsCACerts": {
                "pem": "`cat ./tmp/INSERT_ORG2_CA_CERT`"
            }
        }
    },
    "certificateAuthorities": {
        "ca.jatim.pemilu.com": {
            "url": "https://localhost:7054",
            "caName": "ca-jatim",
            "httpOptions": {
                "verify": false
            }
        },
        "ca.jabar.pemilu.com": {
            "url": "https://localhost:8054",
            "caName": "ca-jabar",
            "httpOptions": {
                "verify": false
            }
        }
    }
}
EOF


cat << EOF > ./byfn-network-jabar.json
{
    "name": "byfn-network",
    "x-type": "hlfv1",
    "version": "1.0.0",
	"client": {
		"organization": "Jabar",
		"connection": {
			"timeout": {
				"peer": {
					"endorser": "300",
					"eventHub": "300",
					"eventReg": "300"
				},
				"orderer": "300"
			}
		}
	},
    "channels": {
        "mychannel": {
            "orderers": [
                "orderer.pemilu.com"
            ],
            "peers": {
                "peer0.jatim.pemilu.com": {
                    "endorsingPeer": true,
                    "chaincodeQuery": true,
                    "eventSource": true
                },
                "peer1.jatim.pemilu.com": {
                    "endorsingPeer": true,
                    "chaincodeQuery": true,
                    "eventSource": true
                },
                "peer0.jabar.pemilu.com": {
                    "endorsingPeer": true,
                    "chaincodeQuery": true,
                    "eventSource": true
                },
                "peer1.jabar.pemilu.com": {
                    "endorsingPeer": true,
                    "chaincodeQuery": true,
                    "eventSource": true
                }
            }
        }
    },
    "organizations": {
        "Jatim": {
            "mspid": "JatimMSP",
            "peers": [
                "peer0.jatim.pemilu.com",
                "peer1.jatim.pemilu.com"
            ],
            "certificateAuthorities": [
                "ca.jatim.pemilu.com"
            ]
        },
        "Jabar": {
            "mspid": "JabarMSP",
            "peers": [
                "peer0.jabar.pemilu.com",
                "peer1.jabar.pemilu.com"
            ],
            "certificateAuthorities": [
                "ca.jabar.pemilu.com"
            ]
        }
    },
    "orderers": {
        "orderer.pemilu.com": {
            "url": "grpcs://localhost:7050",
            "grpcOptions": {
                "ssl-target-name-override": "orderer.pemilu.com"
            },
            "tlsCACerts": {
                "pem": "`cat ./tmp/INSERT_ORDERER_CA_CERT`"
            }
        }
    },
    "peers": {
        "peer0.jatim.pemilu.com": {
            "url": "grpcs://localhost:7051",
            "grpcOptions": {
                "ssl-target-name-override": "peer0.jatim.pemilu.com"
            },
            "tlsCACerts": {
                "pem": "`cat ./tmp/INSERT_ORG1_CA_CERT`"
            }
        },
        "peer1.jatim.pemilu.com": {
            "url": "grpcs://localhost:8051",
            "grpcOptions": {
                "ssl-target-name-override": "peer1.jatim.pemilu.com"
            },
            "tlsCACerts": {
                "pem": "`cat ./tmp/INSERT_ORG1_CA_CERT`"
            }
        },
        "peer0.jabar.pemilu.com": {
            "url": "grpcs://localhost:9051",
            "grpcOptions": {
                "ssl-target-name-override": "peer0.jabar.pemilu.com"
            },
            "tlsCACerts": {
                "pem": "`cat ./tmp/INSERT_ORG2_CA_CERT`"
            }
        },
        "peer1.jabar.pemilu.com": {
            "url": "grpcs://localhost:10051",
            "grpcOptions": {
                "ssl-target-name-override": "peer1.jabar.pemilu.com"
            },
            "tlsCACerts": {
                "pem": "`cat ./tmp/INSERT_ORG2_CA_CERT`"
            }
        }
    },
    "certificateAuthorities": {
        "ca.jatim.pemilu.com": {
            "url": "https://localhost:7054",
            "caName": "ca-jatim",
            "httpOptions": {
                "verify": false
            }
        },
        "ca.jabar.pemilu.com": {
            "url": "https://localhost:8054",
            "caName": "ca-jabar",
            "httpOptions": {
                "verify": false
            }
        }
    }
}
EOF

JATIMADMIN="./crypto-config/peerOrganizations/jatim.pemilu.com/users/Admin@jatim.pemilu.com/msp"
JABARADMIN="./crypto-config/peerOrganizations/jabar.pemilu.com/users/Admin@jabar.pemilu.com/msp"

composer card create -p ./byfn-network-jatim.json -u PeerAdmin -c $JATIMADMIN/signcerts/A*.pem -k $JATIMADMIN/keystore/*_sk -r PeerAdmin -r ChannelAdmin -f PeerAdmin@byfn-network-jatim.card
composer card create -p ./byfn-network-jabar.json -u PeerAdmin -c $JABARADMIN/signcerts/A*.pem -k $JABARADMIN/keystore/*_sk -r PeerAdmin -r ChannelAdmin -f PeerAdmin@byfn-network-jabar.card

composer card import -f PeerAdmin@byfn-network-jatim.card --card PeerAdmin@byfn-network-jatim
composer card import -f PeerAdmin@byfn-network-jabar.card --card PeerAdmin@byfn-network-jabar

composer network install --card PeerAdmin@byfn-network-jatim --archiveFile pemilu-network@0.0.1.bna
composer network install --card PeerAdmin@byfn-network-jabar --archiveFile pemilu-network@0.0.1.bna

composer identity request -c PeerAdmin@byfn-network-jatim -u admin -s adminpw -d alice

composer network start -c PeerAdmin@byfn-network-jatim -n pemilu-network -V 0.0.1 -o endorsementPolicyFile=./endorsement-policy.json -A alice -C alice/admin-pub.pem -A bob -C bob/admin-pub.pem