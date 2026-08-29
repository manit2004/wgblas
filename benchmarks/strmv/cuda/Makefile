CC = nvcc
BIN = bin

all: $(BIN)/diag.strmv $(BIN)/lda.strmv $(BIN)/stride.strmv $(BIN)/strmv $(BIN)/trans.strmv $(BIN)/uplo.strmv

$(BIN):
	mkdir -p $(BIN)

$(BIN)/diag.strmv: diag.strmv.c ../../utils/helpers.h | $(BIN)
	$(CC) diag.strmv.c -o $(BIN)/diag.strmv -lcublas

$(BIN)/lda.strmv: lda.strmv.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.strmv.c -o $(BIN)/lda.strmv -lcublas

$(BIN)/stride.strmv: stride.strmv.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.strmv.c -o $(BIN)/stride.strmv -lcublas

$(BIN)/strmv: strmv.c ../../utils/helpers.h | $(BIN)
	$(CC) strmv.c -o $(BIN)/strmv -lcublas

$(BIN)/trans.strmv: trans.strmv.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.strmv.c -o $(BIN)/trans.strmv -lcublas

$(BIN)/uplo.strmv: uplo.strmv.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.strmv.c -o $(BIN)/uplo.strmv -lcublas

clean:
	rm -rf $(BIN)
