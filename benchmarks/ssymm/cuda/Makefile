CC = nvcc
BIN = bin

all: $(BIN)/alpha.ssymm $(BIN)/beta.ssymm $(BIN)/lda.ssymm $(BIN)/ldb.ssymm $(BIN)/ldc.ssymm $(BIN)/side.ssymm $(BIN)/ssymm $(BIN)/uplo.ssymm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.ssymm: alpha.ssymm.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.ssymm.c -o $(BIN)/alpha.ssymm -lcublas

$(BIN)/beta.ssymm: beta.ssymm.c ../../utils/helpers.h | $(BIN)
	$(CC) beta.ssymm.c -o $(BIN)/beta.ssymm -lcublas

$(BIN)/lda.ssymm: lda.ssymm.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.ssymm.c -o $(BIN)/lda.ssymm -lcublas

$(BIN)/ldb.ssymm: ldb.ssymm.c ../../utils/helpers.h | $(BIN)
	$(CC) ldb.ssymm.c -o $(BIN)/ldb.ssymm -lcublas

$(BIN)/ldc.ssymm: ldc.ssymm.c ../../utils/helpers.h | $(BIN)
	$(CC) ldc.ssymm.c -o $(BIN)/ldc.ssymm -lcublas

$(BIN)/side.ssymm: side.ssymm.c ../../utils/helpers.h | $(BIN)
	$(CC) side.ssymm.c -o $(BIN)/side.ssymm -lcublas

$(BIN)/ssymm: ssymm.c ../../utils/helpers.h | $(BIN)
	$(CC) ssymm.c -o $(BIN)/ssymm -lcublas

$(BIN)/uplo.ssymm: uplo.ssymm.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.ssymm.c -o $(BIN)/uplo.ssymm -lcublas

clean:
	rm -rf $(BIN)
