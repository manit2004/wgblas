CC = nvcc
BIN = bin

all: $(BIN)/ssyrk $(BIN)/trans.ssyrk $(BIN)/lda.ssyrk

$(BIN):
	mkdir -p $(BIN)

$(BIN)/ssyrk: ssyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) ssyrk.c -o $(BIN)/ssyrk -lcublas

$(BIN)/trans.ssyrk: trans.ssyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) trans.ssyrk.c -o $(BIN)/trans.ssyrk -lcublas

$(BIN)/lda.ssyrk: lda.ssyrk.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.ssyrk.c -o $(BIN)/lda.ssyrk -lcublas

clean:
	rm -rf $(BIN)
