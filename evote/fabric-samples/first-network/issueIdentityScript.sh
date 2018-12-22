#!/bin/sh


if [ -z ${1} ]; then
	composer identity issue -c alice@pemilu-network -f dyahayu.card -u dyahayu -a "resource:org.pemilu.pemilihan.VotingOrganizer#1" --issuer

	composer card import -f dyahayu.card
	composer network ping -c dyahayu@pemilu-network

	composer identity issue -c alice@pemilu-network -f monitoring1.card -u monitoring1 -a "resource:org.pemilu.pemilihan.MonitoringWebServer#1"

	composer card import -f monitoring1.card
	composer network ping -c monitoring1@pemilu-network

	composer identity issue -c bob@pemilu-network -f monitoring2.card -u monitoring2 -a "resource:org.pemilu.pemilihan.MonitoringWebServer#2"

	composer card import -f monitoring2.card
	composer network ping -c monitoring2@pemilu-network

	exit
fi

composer identity issue -c dyahayu@pemilu-network -f bukanDyahAyu.card -u bukanDyahAyu -a "resource:org.pemilu.pemilihan.Pemilih#1"

composer card import -f bukanDyahAyu.card
composer network ping -c bukanDyahAyu@pemilu-network
