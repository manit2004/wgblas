CC = nvcc
BIN = bin

all: $(BIN)/alpha.strsm $(BIN)/diag.strsm $(BIN)/lda.strsm $(BIN)/ldb.strsm $(BIN)/side.strsm $(BIN)/strsm $(BIN)/transA.strsm $(BIN)/uplo.strsm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.strsm: alpha.strsm.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.strsm.c -o $(BIN)/alpha.strsm -lcublas

$(BIN)/diag.strsm: diag.strsm.c ../../utils/helpers.h | $(BIN)
	$(CC) diag.strsm.c -o $(BIN)/diag.strsm -lcublas

$(BIN)/lda.strsm: lda.strsm.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.strsm.c -o $(BIN)/lda.strsm -lcublas

$(BIN)/ldb.strsm: ldb.strsm.c ../../utils/helpers.h | $(BIN)
	$(CC) ldb.strsm.c -o $(BIN)/ldb.strsm -lcublas

$(BIN)/side.strsm: side.strsm.c ../../utils/helpers.h | $(BIN)
	$(CC) side.strsm.c -o $(BIN)/side.strsm -lcublas

$(BIN)/strsm: strsm.c ../../utils/helpers.h | $(BIN)
	$(CC) strsm.c -o $(BIN)/strsm -lcublas

$(BIN)/transA.strsm: transA.strsm.c ../../utils/helpers.h | $(BIN)
	$(CC) transA.strsm.c -o $(BIN)/transA.strsm -lcublas

$(BIN)/uplo.strsm: uplo.strsm.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.strsm.c -o $(BIN)/uplo.strsm -lcublas

clean:
	rm -rf $(BIN)
