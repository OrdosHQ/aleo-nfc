program aleo_nfc_chip_v2.aleo {

    struct ChipData {
        finger_print: u128,
        id: u128,
        kind: u128,    
    }

    record Chip {
        owner: address,
        finger_print: u128,
        id: u128,
        kind: u128,    
    }

    mapping merch_owners: ChipData => [address; 32];
    mapping owners_merch: address => [ChipData; 32];

    mapping all_chips: field => bool;
    mapping registered_chips: field => bool;

    transition announce_ownership(chip: Chip) -> Chip {
        return chip;
    }

    transition add_chip(chip_hash: field) -> bool {
        assert (self.caller == aleo1r3qlsxnuux6rkrhk24rktdtzu7kjr3c2fw5fvtp6a9dwghe0xgzs9c2nhu);
        return true then finalize(chip_hash);
    }

    finalize add_chip(chip_hash: field) {
        assert(Mapping::contains(registered_chips, chip_hash) == false);
        assert(Mapping::contains(all_chips, chip_hash) == false);
        Mapping::set(all_chips, chip_hash, true);
    }

    transition register(chip_data: ChipData, owner: address) -> Chip {
        return Chip {
            owner,
            id: chip_data.id,
            kind: chip_data.kind,
            finger_print: chip_data.finger_print,
        } then finalize(BHP256::hash_to_field(chip_data));
    }

    finalize register(public chip_hash: field) {
        assert(Mapping::contains(registered_chips, chip_hash) == false);
        assert(Mapping::contains(all_chips, chip_hash) == true);
        Mapping::set(registered_chips, chip_hash, true);
   }


    transition transfer(chip: Chip, recepient: address) -> Chip {
        return Chip {
            owner: recepient,
            id: chip.id,
            kind: chip.kind,
            finger_print: chip.finger_print,
        };
    }

    transition get_chip_hash(chip_data: ChipData) -> field {
        return BHP256::hash_to_field(chip_data);
    }
}
