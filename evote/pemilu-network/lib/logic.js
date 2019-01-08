/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * Write your transction processor functions here
 */

/**
 * Pemilih menggunakan hak suara
 * @param {org.evote.pemilihan.GunakanSuara} tx
 * @transaction
 */
async function GunakanSuara(tx) {
    tx.suara.sudahDigunakan = true;
    tx.suara.pemilih = null;
    tx.suara.owner = tx.kandidat;

    // javascript promise
    return getAssetRegistry('org.evote.pemilihan.Suara')
        .then(function (suaraRegistry) {
            return suaraRegistry.update(tx.suara);
        })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * VotingOrganizer bisa menambah suara
 * @param {org.evote.pemilihan.TambahSuara} tx
 * @transaction
 */
async function TambahSuara(tx) {
    const factory = getFactory();
    let newSuara = factory.newResource('org.evote.pemilihan', 'Suara', tx.x);
    newSuara.sudahDigunakan = false;
    newSuara.owner = null;
    newSuara.pemilih = tx.pemilih;

    getAssetRegistry('org.evote.pemilihan.Suara')
        .then(function (suaraRegistry) {
            return suaraRegistry.add(newSuara);
        })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * VotingOrganizer bisa menambah pemilih
 * @param {org.evote.pemilihan.TambahPemilih} tx
 * @transaction
 */
async function TambahPemilih(tx) {
    const factory = getFactory();
    let newParticipant = factory.newResource('org.evote.pemilihan', 'Pemilih', tx.nik);
    newParticipant.nama = tx.nama;
    newParticipant.tempatLahir = tx.tempatLahir;
    newParticipant.tanggalLahir = tx.tanggalLahir;

    return getParticipantRegistry('org.evote.pemilihan.Pemilih')
        .then(function (pemilihRegistry) {
            return pemilihRegistry.add(newParticipant);
        })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * VotingOrganizer bisa menambah kandidat
 * @param {org.evote.pemilihan.TambahKandidat} tx
 * @transaction
 */
async function TambahKandidat(tx) {
    const factory = getFactory();
    let newParticipant = factory.newResource('org.evote.pemilihan', 'Kandidat', tx.kandidatId);
    newParticipant.namaCalon = tx.namaCalon;
    newParticipant.namaWakilCalon = tx.namaWakilCalon;
    newParticipant.nikCalon = tx.nikCalon;
    newParticipant.nikWakilCalon = tx.nikWakilCalon;
    newParticipant.nomorUrut = tx.nomorUrut;
    newParticipant.jargon = tx.jargon;

    return getParticipantRegistry('org.evote.pemilihan.Kandidat')
        .then(function (kandidatRegistry) {
            return kandidatRegistry.add(newParticipant);
        })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * VotingOrganizer bisa membuat suara
 * @param {org.evote.pemilihan.BuatOperator} tx
 * @transaction
 */
async function BuatOperator(tx) {
    const factory = getFactory();
    let newParticipant = factory.newResource('org.evote.pemilihan', 'Operator', tx.operatorId);
    newParticipant.alamat = tx.alamat;

    return getParticipantRegistry('org.evote.pemilihan.Operator')
        .then(function (operatorRegistry) {
            return operatorRegistry.add(newParticipant);
        })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * Handle a transaction that returns a string.
 * @param {org.evote.pemilihan.GetBusinessCardName} transaction
 * @transaction
 */
async function GetBusinessCardName(transaction) {
    return getAssetRegistry('org.evote.pemilihan.Account')
        .then(function (accountRegistry) {
            return accountRegistry.getAll().then(function (resourceCollection) {
                resourceCollection.every(function(account, idx) {
                    if (account.username === transaction.username &&
                        account.password === transaction.password) {
                        let factory = getFactory();
                        let newEvent = factory.newEvent('org.evote.pemilihan', 'BusinessCardNameFound');
                        newEvent.businessCardName = account.cardName;
                        newEvent.role = account.role;
                        newEvent.username = account.username;

                        emit(newEvent);
                        return false;
                    } else {
                        return true;
                    }
                });
            });
        })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * Handle a transaction that returns a string.
 * @param {org.evote.pemilihan.BacaHasilPemilihan} transaction
 * @transaction
 */

async function BacaHasilPemilihan(transaction) {
    var kandidatId = [];
    var nomorUrut = [];
    var namaCalon = [];
    var namaWakilCalon = [];
    var jumlahSuara = [];

    return getParticipantRegistry('org.evote.pemilihan.Kandidat').then(function (kandidatRegistry) {
        return kandidatRegistry.getAll().then(function (resourceCollection) {
            resourceCollection.forEach(function (resource) {
                kandidatId.push(resource.kandidatId);
                nomorUrut.push(resource.nomorUrut);
                namaCalon.push(resource.namaCalon);
                namaWakilCalon.push(resource.namaWakilCalon);
                jumlahSuara.push(0);
            });

            return getAssetRegistry('org.evote.pemilihan.Suara').then(function (suaraRegistry) {
                return suaraRegistry.getAll().then(function (suaraList) {
                    suaraList.forEach(function (suara) {
                        var kddtId = suara.owner.getIdentifier();
                        for (var i = 0; i < nomorUrut.length; i++) {
                            if (kandidatId[i] == kddtId) {
                                jumlahSuara[i] = jumlahSuara[i] + 1;
                            }
                        }
                    });
                    var factory = getFactory();
                    var newEvent = factory.newEvent('org.evote.pemilihan', 'HasilPemilihanTerbaca');
                    newEvent.nomorUrut = nomorUrut;
                    newEvent.namaCalon = namaCalon;
                    newEvent.namaWakilCalon = namaWakilCalon;
                    newEvent.jumlahSuara = jumlahSuara;
                    emit(newEvent);
                }).catch(function (error) {
                    console.error(error);
                });
            }).catch(function (error) {
                console.error(error);
            });
        });
    })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * VotingOrganizer bisa membuat suara
 * @param {org.evote.pemilihan.BuatGuest} tx
 * @transaction
 */
async function BuatGuest(tx) {
    const factory = getFactory();
    let newParticipant = factory.newResource('org.evote.pemilihan', 'Guest', tx.guestId);

    return getParticipantRegistry('org.evote.pemilihan.Guest')
        .then(function (guestRegistry) {
            return guestRegistry.add(newParticipant);
        })
        .catch(function (error) {
            console.error(error);
        });
}

/**
 * VotingOrganizer bisa membuat suara
 * @param {org.evote.pemilihan.BuatAccount} tx
 * @transaction
 */
async function BuatAccount(tx) {
    const factory = getFactory();
    let newAsset = factory.newResource('org.evote.pemilihan', 'Account', tx.accountId);
    newAsset.username = tx.username;
    newAsset.password = tx.password;
    newAsset.cardName = tx.cardName;
    newAsset.role = tx.role;

    return getAssetRegistry('org.evote.pemilihan.Account')
        .then(function (accountRegistry) {
            return accountRegistry.add(newAsset);
        })
        .catch(function (error) {
            console.error(error);
        });
}