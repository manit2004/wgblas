CC = nvcc
BIN = bin

all: $(BIN)/diag.dtrmv $(BIN)/lda.dtrmv $(BIN)/stride.dtrmv $(BIN)/dtrmv $(BIN)/trans.dtrmv $(BIN)/uplo.dtrmv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/diag.dtrmv: diag.dtrmv.c ../../utils/helpers.h | $(BIN)
	$(CC) diag.dtrmv.c -o $(BIN)/diag.dtrmv -lcublas

$(BIN)/lda.dtrmv: lda.dtrmv.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.dtrmv.c -o $(BIN)/lda.dtrmv -lcublas

$(BIN)/stride.dtrmv: stride.dtrmv.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.dtrmv.c -o $(BIN)/stride.dtrmv -lcublas

$(BIN)/dtrmv: dtrmv.c ../../utils/helpers.h | $(BIN)
	$(CC) dtrmv.c -o $(BIN)/dtrmv -lcublas

$(BIN)/trans.dtrmv: trans.dtrmv.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.dtrmv.c -o $(BIN)/trans.dtrmv -lcublas

$(BIN)/uplo.dtrmv: uplo.dtrmv.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.dtrmv.c -o $(BIN)/uplo.dtrmv -lcublas

clean:
	rm -rf $(BIN)
