const circulationLogs = [
    {
        logId: "L001",
        studentCode: "SV001",
        bookIsbn: "ISBN001",
        status: "BORROWING",
        fineAmount: 0,
        borrowDate: "2026-10-01",
        dueDate: "2026-10-05",
        returnDate: null,
        settled: false
    },
    {
        logId: "L002",
        studentCode: "SV002",
        bookIsbn: "ISBN002",
        status: "BORROWING",
        fineAmount: 0,
        borrowDate: "2026-10-02",
        dueDate: "2026-10-05",
        returnDate: null,
        settled: false
    },
    {
        logId: "L003",
        studentCode: "SV003",
        bookIsbn: "ISBN003",
        status: "RETURNED",
        fineAmount: 10000,
        borrowDate: "2026-09-01",
        dueDate: "2026-09-05",
        returnDate: "2026-09-07",
        settled: true,
        settledDate: "2026-09-07"
    }
];

const validStudents = ["SV001", "SV002", "SV003", "SV004"];

// 1. Muon sach moi
const newStudentCode = "SV004";
const newBookIsbn = "ISBN004";
const newLogId = "L004";

let isStudentValid = false;

for (let i = 0; i < validStudents.length; i++) {
    if (validStudents[i] === newStudentCode) {
        isStudentValid = true;
        break;
    }
}

if (isStudentValid) {
    circulationLogs.push({
        logId: newLogId,
        studentCode: newStudentCode,
        bookIsbn: newBookIsbn,
        status: "BORROWING",
        fineAmount: 0,
        borrowDate: "2026-10-10",
        dueDate: "2026-10-12",
        returnDate: null,
        settled: false
    });

    console.log("Muon sach thanh cong!");
} else {
    console.log("Ma sinh vien khong hop le!");
}

// 2. Gia han sach L001 them 3 ngay
const renewLogId = "L001";

for (let i = 0; i < circulationLogs.length; i++) {
    if (circulationLogs[i].logId === renewLogId) {
        if (circulationLogs[i].status === "BORROWING") {
            const currentDueDate = new Date(circulationLogs[i].dueDate);
            currentDueDate.setDate(currentDueDate.getDate() + 3);

            circulationLogs[i].dueDate =
                currentDueDate.toISOString().slice(0, 10);

            console.log("Gia han sach thanh cong!");
            console.log("Han tra moi: " + circulationLogs[i].dueDate);
        } else {
            console.log("Khong the gia han giao dich nay!");
        }

        break;
    }
}

// 3. Tra sach va tinh tien phat
const returnLogId = "L001";
const actualReturnDate = "2026-10-10";
const isBookLost = false;

for (let i = 0; i < circulationLogs.length; i++) {
    if (circulationLogs[i].logId === returnLogId) {
        if (circulationLogs[i].status !== "BORROWING") {
            console.log("Giao dich khong o trang thai dang muon!");
            break;
        }

        circulationLogs[i].returnDate = actualReturnDate;

        if (isBookLost) {
            circulationLogs[i].status = "LOST";
            circulationLogs[i].fineAmount = 200000;
        } else {
            circulationLogs[i].status = "RETURNED";

            const dueDate = new Date(circulationLogs[i].dueDate);
            const returnDate = new Date(actualReturnDate);

            const lateDays = Math.max(
                0,
                Math.floor((returnDate - dueDate) / (1000 * 60 * 60 * 24))
            );

            circulationLogs[i].fineAmount = lateDays * 5000;
        }

        circulationLogs[i].settled = true;
        circulationLogs[i].settledDate = actualReturnDate;

        console.log("Trang thai: " + circulationLogs[i].status);
        console.log("Tien phat: " + circulationLogs[i].fineAmount + " VND");

        break;
    }
}

// 4. Thanh toan tien phat cho giao dich da hoan tat
const settleLogId = "L002";

for (let i = 0; i < circulationLogs.length; i++) {
    if (circulationLogs[i].logId === settleLogId) {
        if (
            circulationLogs[i].status === "BORROWING" &&
            circulationLogs[i].fineAmount === 0
        ) {
            console.log("Sach van dang duoc muon, chua the quyet toan!");
        } else {
            circulationLogs[i].settled = true;
            circulationLogs[i].settledDate = "2026-10-10";
            console.log("Da quyet toan giao dich " + settleLogId);
        }

        break;
    }
}

// 5. Xoa nhat ky da quyet toan qua 30 ngay
const today = new Date("2026-10-10");

for (let i = circulationLogs.length - 1; i >= 0; i--) {
    const log = circulationLogs[i];

    if (
        log.status !== "BORROWING" &&
        log.settled === true &&
        log.settledDate !== undefined
    ) {
        const settledDate = new Date(log.settledDate);
        const daysSinceSettlement = Math.floor(
            (today - settledDate) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceSettlement > 30) {
            circulationLogs.splice(i, 1);
            console.log("Da xoa nhat ky: " + log.logId);
        }
    }
}

// 6. Bao cao tong ket cuoi ngay
let borrowingCount = 0;
let returnedCount = 0;
let lostCount = 0;
let totalFineCollected = 0;
let totalUnsettledFine = 0;

console.log("");
console.log("==============================================================");
console.log("          BAO CAO LUU CHUYEN SACH CUOI NGAY");
console.log("==============================================================");

for (let i = 0; i < circulationLogs.length; i++) {
    const log = circulationLogs[i];

    if (log.status === "BORROWING") {
        borrowingCount++;
    }

    if (log.status === "RETURNED") {
        returnedCount++;
    }

    if (log.status === "LOST") {
        lostCount++;
    }

    if (log.settled === true) {
        totalFineCollected += log.fineAmount;
    } else {
        totalUnsettledFine += log.fineAmount;
    }

    console.log(
        log.logId.padEnd(8) +
        log.studentCode.padEnd(12) +
        log.bookIsbn.padEnd(12) +
        log.status.padEnd(12) +
        log.fineAmount.toLocaleString("vi-VN") + " VND"
    );
}

console.log("--------------------------------------------------------------");
console.log("Tong giao dich: " + circulationLogs.length);
console.log("So sach dang muon: " + borrowingCount);
console.log("So sach da tra: " + returnedCount);
console.log("So sach bi mat: " + lostCount);
console.log("Tong tien phat da quyet toan: " +
    totalFineCollected.toLocaleString("vi-VN") + " VND");
console.log("Tong tien phat chua quyet toan: " +
    totalUnsettledFine.toLocaleString("vi-VN") + " VND");
console.log("==============================================================");