CC = nvcc
BIN = bin

all: $(BIN)/alpha.dgemm $(BIN)/beta.dgemm $(BIN)/ldb.dgemm $(BIN)/ldc.dgemm $(BIN)/dgemm $(BIN)/trans.dgemm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.dgemm: alpha.dgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.dgemm.c -o $(BIN)/alpha.dgemm -lcublas

$(BIN)/beta.dgemm: beta.dgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) beta.dgemm.c -o $(BIN)/beta.dgemm -lcublas

$(BIN)/ldb.dgemm: ldb.dgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) ldb.dgemm.c -o $(BIN)/ldb.dgemm -lcublas

$(BIN)/ldc.dgemm: ldc.dgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) ldc.dgemm.c -o $(BIN)/ldc.dgemm -lcublas

$(BIN)/dgemm: dgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) dgemm.c -o $(BIN)/dgemm -lcublas

$(BIN)/trans.dgemm: trans.dgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.dgemm.c -o $(BIN)/trans.dgemm -lcublas

clean:
	rm -rf $(BIN)
