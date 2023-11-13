interface Login {
    username: string | null;
    password: string | null;
}
interface Candidate {
    alamat: string;
    dapil: number;
    foto_caleg: string;
    id: number;
    jenis_dapil: string;
    jenis_kelamin: string;
    logo_partai: string;
    nama_calon: string;
    nama_partai: string;
    no_urut: number;
    suara?: number | null;
}

let defaultCandidateValue: Candidate = {
    alamat: '',
    dapil: 0,
    foto_caleg: '',
    id: 0,
    jenis_dapil: '',
    jenis_kelamin: '',
    logo_partai: '',
    nama_calon: '',
    nama_partai: '',
    no_urut: 0,
    suara: null
}

interface VoteCaleg {
    id_caleg: number | null,
    no_tps: number | null,
    total_suara: number | null,
    upload_bukti?: string | null
}

let defaultVoteCaleg: VoteCaleg = {
    id_caleg: null,
    no_tps: null,
    total_suara: null,
}

interface ProgressIndicator {
    value: number;
    view: boolean;
}

let defaultProgressIndicator: ProgressIndicator = {
    value: 0,
    view: false
}

let defaultLogin: Login = {
    username: null,
    password: null
}

interface Vote {
    id: number | null;
    id_caleg: number | null;
    tps: number | null;
    suara: number | null;
    file_bukti: string| null;
}

let defaultVote : Vote =  {
    id: null,
    id_caleg:  null,
    tps: null,
    suara: null,
    file_bukti: null
}

export {
    Candidate,
    defaultCandidateValue,
    VoteCaleg,
    defaultVoteCaleg,
    ProgressIndicator,
    defaultProgressIndicator,
    Login,
    defaultLogin,
    Vote,
    defaultVote
}