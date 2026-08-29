CC = nvcc
BIN = bin

all: $(BIN)/alpha.strmm $(BIN)/diag.strmm $(BIN)/lda.strmm $(BIN)/ldb.strmm $(BIN)/side.strmm $(BIN)/strmm $(BIN)/transA.strmm $(BIN)/uplo.strmm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.strmm: alpha.strmm.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.strmm.c -o $(BIN)/alpha.strmm -lcublas

$(BIN)/diag.strmm: diag.strmm.c ../../utils/helpers.h | $(BIN)
	$(CC) diag.strmm.c -o $(BIN)/diag.strmm -lcublas

$(BIN)/lda.strmm: lda.strmm.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.strmm.c -o $(BIN)/lda.strmm -lcublas

$(BIN)/ldb.strmm: ldb.strmm.c ../../utils/helpers.h | $(BIN)
	$(CC) ldb.strmm.c -o $(BIN)/ldb.strmm -lcublas

$(BIN)/side.strmm: side.strmm.c ../../utils/helpers.h | $(BIN)
	$(CC) side.strmm.c -o $(BIN)/side.strmm -lcublas

$(BIN)/strmm: strmm.c ../../utils/helpers.h | $(BIN)
	$(CC) strmm.c -o $(BIN)/strmm -lcublas

$(BIN)/transA.strmm: transA.strmm.c ../../utils/helpers.h | $(BIN)
	$(CC) transA.strmm.c -o $(BIN)/transA.strmm -lcublas

$(BIN)/uplo.strmm: uplo.strmm.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.strmm.c -o $(BIN)/uplo.strmm -lcublas

clean:
	rm -rf $(BIN)
