CC = nvcc
BIN = bin

all: $(BIN)/sgemm $(BIN)/trans.sgemm $(BIN)/ldb.sgemm

$(BIN):
	mkdir -p $(BIN)

$(BIN)/sgemm: sgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) sgemm.c -o $(BIN)/sgemm -lcublas

$(BIN)/trans.sgemm: trans.sgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.sgemm.c -o $(BIN)/trans.sgemm -lcublas

$(BIN)/ldb.sgemm: ldb.sgemm.c ../../utils/helpers.h | $(BIN)
	$(CC) ldb.sgemm.c -o $(BIN)/ldb.sgemm -lcublas

clean:
	rm -rf $(BIN)
