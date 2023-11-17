program aleo_nfc_chip_v2.aleo;

struct ChipData:
    finger_print as u128;
    id as u128;
    kind as u128;

record Chip:
    owner as address.private;
    finger_print as u128.private;
    id as u128.private;
    kind as u128.private;


mapping merch_owners:
	key as ChipData.public;
	value as [address; 32u32].public;


mapping owners_merch:
	key as address.public;
	value as [ChipData; 32u32].public;


mapping all_chips:
	key as field.public;
	value as boolean.public;


mapping registered_chips:
	key as field.public;
	value as boolean.public;

function announce_ownership:
    input r0 as Chip.record;
    output r0 as Chip.record;


function add_chip:
    input r0 as field.private;
    is.eq self.caller aleo1r3qlsxnuux6rkrhk24rktdtzu7kjr3c2fw5fvtp6a9dwghe0xgzs9c2nhu into r1;
    assert.eq r1 true;
    async add_chip r0 into r2;
    output true as boolean.private;
    output r2 as aleo_nfc_chip_v2.aleo/add_chip.future;

finalize add_chip:
    input r0 as field.public;
    contains registered_chips[r0] into r1;
    is.eq r1 false into r2;
    assert.eq r2 true;
    contains all_chips[r0] into r3;
    is.eq r3 false into r4;
    assert.eq r4 true;
    set true into all_chips[r0];


function register:
    input r0 as ChipData.private;
    input r1 as address.private;
    cast r1 r0.finger_print r0.id r0.kind into r2 as Chip.record;
    hash.bhp256 r0 into r3 as field;
    async register r3 into r4;
    output r2 as Chip.record;
    output r4 as aleo_nfc_chip_v2.aleo/register.future;

finalize register:
    input r0 as field.public;
    set true into registered_chips[r0];


function transfer:
    input r0 as Chip.record;
    input r1 as address.private;
    cast r1 r0.finger_print r0.id r0.kind into r2 as Chip.record;
    output r2 as Chip.record;


function get_chip_hash:
    input r0 as ChipData.private;
    hash.bhp256 r0 into r1 as field;
    output r1 as field.private;
