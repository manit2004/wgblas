CC = nvcc
BIN = bin

all: $(BIN)/alpha.sgemm $(BIN)/beta.sgemm $(BIN)/ldb.sgemm $(BIN)/ldc.sgemm $(BIN)/sgemm $(BIN)/trans.sgemm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.sgemm: alpha.sgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.sgemm.c -o $(BIN)/alpha.sgemm -lcublas

$(BIN)/beta.sgemm: beta.sgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) beta.sgemm.c -o $(BIN)/beta.sgemm -lcublas

$(BIN)/ldb.sgemm: ldb.sgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) ldb.sgemm.c -o $(BIN)/ldb.sgemm -lcublas

$(BIN)/ldc.sgemm: ldc.sgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) ldc.sgemm.c -o $(BIN)/ldc.sgemm -lcublas

$(BIN)/sgemm: sgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) sgemm.c -o $(BIN)/sgemm -lcublas

$(BIN)/trans.sgemm: trans.sgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.sgemm.c -o $(BIN)/trans.sgemm -lcublas

clean:
	rm -rf $(BIN)
