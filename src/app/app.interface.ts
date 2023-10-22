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
}

interface VoteCaleg{
    id_caleg: number | null;
    no_tps: number | null,
    total_suara: number | null
}

let defaultVoteCaleg: VoteCaleg = {
    id_caleg: null,
    no_tps: null,
    total_suara: null
}

interface ProgressIndicator {
    value: number;
    view: boolean;
}

let defaultProgressIndicator: ProgressIndicator = {
    value: 0,
    view: false
  }

export {
    Candidate,
    defaultCandidateValue,
    VoteCaleg,
    defaultVoteCaleg,
    ProgressIndicator,
    defaultProgressIndicator
}