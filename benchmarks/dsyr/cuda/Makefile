CC = nvcc
BIN = bin

all: $(BIN)/alpha.dsyr $(BIN)/lda.dsyr $(BIN)/dsyr $(BIN)/stride.dsyr $(BIN)/uplo.dsyr

$(BIN):
	mkdir -p $(BIN)

$(BIN)/alpha.dsyr: alpha.dsyr.c ../../utils/helpers.h | $(BIN)
	$(CC) alpha.dsyr.c -o $(BIN)/alpha.dsyr -lcublas

$(BIN)/lda.dsyr: lda.dsyr.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.dsyr.c -o $(BIN)/lda.dsyr -lcublas

$(BIN)/dsyr: dsyr.c ../../utils/helpers.h | $(BIN)
	$(CC) dsyr.c -o $(BIN)/dsyr -lcublas

$(BIN)/stride.dsyr: stride.dsyr.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.dsyr.c -o $(BIN)/stride.dsyr -lcublas

$(BIN)/uplo.dsyr: uplo.dsyr.c ../../utils/helpers.h | $(BIN)
	$(CC) uplo.dsyr.c -o $(BIN)/uplo.dsyr -lcublas

clean:
	rm -rf $(BIN)
